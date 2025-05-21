"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import SearchInput from "@/components/common/CommonSearchBar";
import TableSkeleton from "@/components/common/TableSkeloton";
import Pagination from "@/components/admin-components/Pagination";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import TitleSection from "@/components/common/TitleSection";
import { apiCall } from "@/utils/services/request";
import { filterBySearch, getPaginatedData, sortData } from "./helper";
import { API_ROUTES } from "@/utils/constant";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortByKey, setSortByKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<IHistory[]>([]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  useEffect(() => {
    const paginated = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setRowData(paginated);
  }, [currentPage, data, itemsPerPage]);

  const searchEvents = (search: string) => {
    const result = filterBySearch(allData, search);
    const rowResult = getPaginatedData(result, 1, itemsPerPage);

    setData(result);
    setRowData(rowResult);
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const sortEventsByKey = (key: string) => {
    let newOrder: "asc" | "desc" = "asc";

    if (key === sortByKey) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    const result = sortData(data, key, newOrder);
    const rowResult = getPaginatedData(result, 1, itemsPerPage);
    setRowData(rowResult);
    setAllData(result);
    setSortOrder(newOrder);
    setSortByKey(key);
  };

  const renderSortableRow = (title: string, sortKey: string) => {
    return (
      <button
        className="flex gap-1 uppercase cursor-pointer bg-transparent border-none p-0"
        onClick={() => sortEventsByKey(sortKey)}
      >
        <p>{title}</p>
        {sortByKey === sortKey && (
          <div>
            {sortOrder === "asc" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </div>
        )}
      </button>
    );
  };

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
          <div className="overflow-x-auto py-4 bg-white rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3">
                    {renderSortableRow("Description", "description")}
                  </th>
                  <th className="p-3">
                    {renderSortableRow("Activity Type", "activityType")}
                  </th>
                  <th className="p-3">
                    {renderSortableRow("Points", "points")}
                  </th>
                  <th className="p-3">
                    {renderSortableRow("Date and Time", "createdAt")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={5} columns={4} />
                ) : <>
                  {rowData.length > 0 ? (
                    rowData.map((item, index) => {
                      return (
                        <tr key={`${index + 1}`} className="border-b hover:bg-gray-50">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColor[item.activityType.toLowerCase()]}`}>
                              {item.activityType}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`rounded-full text-xs font-semibold ${item.activityType === "EARN" ? 'text-green-700' : 'text-red-700'}`}>
                              {item.activityType === "EARN" ? '+ ' : '- '}{item.points}
                            </span>
                          </td>
                          <td className="p-3">
                            {moment(item.createdAt).format("DD MMM YYYY, h:mm A")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        <p className="my-3 font-bold">No data found</p>
                      </td>
                    </tr>
                  )}
                </>
                }
              </tbody>
            </table>
          </div>
          {data.length > 0 && (
            <Pagination
              totalItems={totalItems}
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
}

export default RewardHistory;