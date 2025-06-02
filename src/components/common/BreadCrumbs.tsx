"use client";

import { useRouter } from "next/navigation";

// icons
import { ChevronRight } from "lucide-react";

// types
import { IBreadcrumbsProps } from "@/utils/types";

// constant
import { ROLE, ROUTES } from "@/utils/constant";

// helpers
import { getUserRole } from "@/utils/helper";

const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({ breadcrumbsItems }) => {
  const router = useRouter();

  const navToDashboard = () => {
    const role = getUserRole();
    if (role !== "") {
      switch (role) {
        case ROLE.Admin:
          return router.push(ROUTES.ADMIN.DASHBOARD);
        case ROLE.Organizer:
          return router.push(ROUTES.ORGANIZER.DASHBOARD);
        default:
          return router.push(ROUTES.HOME);
      }
    }
    return false;
  };

  const handleClick = (path: string) => {
    if (path === "") {
      return false;
    }
    router.push(path);
  };

  return (
    <nav
      className="flex items-center space-x-1 text-md mb-2"
      aria-label="Breadcrumb"
    >
      <div
        onClick={navToDashboard}
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
