"use client";

import { useRouter } from "next/navigation";

// icons
import { Home, ChevronRight } from "lucide-react";

// types
import { IBreadcrumbsProps } from "@/utils/types";

// constant
import { ROUTES } from "@/utils/constant";

const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({ breadcrumbsItems }) => {
  const router = useRouter();

  const navToAdminDashboard = () => {
    router.push(ROUTES.ADMIN.DASHBOARD)
  }

  const handleClick = (path: string) => {

    if(path === "") {
        return false
    }
    router.push(path)
  };

  return (
    <nav className="flex items-center space-x-1 text-md mb-2" aria-label="Breadcrumb">
      <div
        onClick={navToAdminDashboard}
        className="flex items-center space-x-1 p-1  rounded cursor-pointer text-gray-500 hover:underline font-semibold"
      >
        Home
      </div>

      {breadcrumbsItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight size={16} className="text-gray-900 font-bold" />
          <div
            onClick={() => handleClick(item.navigateTo)}
            className={`p-1 rounded font-semibold cursor-pointer ${
              index === breadcrumbsItems.length - 1
                ? "text-blue-500"
                : "text-gray-500 hover:underline"
            }`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
