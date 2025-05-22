"use client";

import { useEffect, useState } from "react";
import moment from "moment";

import SearchInput from "@/components/common/CommonSearchBar";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import TitleSection from "@/components/common/TitleSection";
import { apiCall } from "@/utils/services/request";
import { filterBySearch } from "./helper";
import { API_ROUTES } from "@/utils/constant";
import { Column } from "@/utils/types";
import DataTable from "@/components/common/DataTable";

export interface IHistory {
  description: string;
  activityType: string;
  points: number;
  createdAt: string;
}

const typeColor: Record<string, string> = {
  redeem: "bg-blue-100 text-blue-700",
  earn: "bg-green-100 text-green-700",
};

const RewardHistory = () => {
  const [data, setData] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const [allData, setAllData] = useState<IHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRewardHistory = async () => {
      setLoading(true);
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.USER.REWARD_HISTORY,
      });
      if (res.success) {
        setData(res.data);
        setAllData(res.data);
      }
      setLoading(false);
    }
    fetchRewardHistory();
  }, []);


  const searchEvents = (search: string) => {
    const result = filterBySearch(allData, search);
    setData(result);
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const tableHeaders: Column<IHistory>[] = [
    { header: 'Description', key: 'description' },
    { header: 'Activity Type', key: 'activityType', render: (row) => 
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColor[row.activityType.toLowerCase()]}`}>
        {row.activityType}
      </span>
     },
    { header: 'Points', key: 'points', render : (item) =>
      <span className={`rounded-full text-xs font-semibold ${item.activityType === "EARN" ? 'text-green-700' : 'text-red-700'}`}>
        {item.activityType === "EARN" ? '+ ' : '- '}{item.points}
      </span>
     },
    { header: 'Date and Time', key: 'createdAt', render: (item) => <p>{moment(item.createdAt).format("DD MMM YYYY, h:mm A")}</p> },
  ];

  return (
    <div className='min-h-[calc(100vh-76px)] flex flex-col'>
      <div className="p-3 md:p-10">
        <ChartCard>
          <TitleSection title='Reward Point History' />
          <div className="flex gap-4 justify-between items-start sm:items-center my-5">
            <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-2 space-x-2 w-full">
              <SearchInput
                value={searchQuery}
                onChange={(val) => searchEvents(val)}
                wrapperClassName="md:w-[50%]"
                inputClassName="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Data Table + Pagination */}
          <DataTable
            loading={loading}
            data={data}
            columns={tableHeaders}
            actions={[]}
            showSerialNumber
          />
        </ChartCard>
      </div>
    </div>
  );
}

export default RewardHistory;