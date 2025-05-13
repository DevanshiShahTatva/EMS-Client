"use client";

import { useEffect, useState } from "react";
import moment from "moment";

import { apiCall } from "@/utils/services/request";
import TableSkeleton from "@/components/common/TableSkeloton";
import { API_ROUTES } from "@/utils/constant";

interface IHistory {
  activityType: string;
  createdAt: string;
  description: string;
  points: number;
}

const RewardHistory = () => {
  const [history, setHistory] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewardHistory = async () => {
      setLoading(true);
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.USER.REWARD_HISTORY,
      });
      if (res.success) {
        setHistory(res.data);
      }
      setLoading(false);
    }
    fetchRewardHistory();
  }, []);

  return (
    <div>
      <div className="p-10 h-[calc(100vh-77px)] overflow-x-auto py-4 bg-white rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3">Activity Type</th>
              <th className="p-3">Points</th>
              <th className="p-3">Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={5} columns={4} />
            ) : <>
              {history.length > 0 ? (
                history.map((item, index) => {
                  return (
                    <tr key={`${index + 1}`} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3">{item.activityType}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold`}
                        >
                          {item.points}
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
                    <p className="my-3 font-bold">No transaction found</p>
                  </td>
                </tr>
              )}
            </>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RewardHistory;