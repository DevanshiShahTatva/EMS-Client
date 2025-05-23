"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import { BREAD_CRUMBS_ITEMS } from "@/utils/constant";
import TicketTypeDropdown from "@/components/admin-components/TicketTypeDropdown";
import EventCategoryDropdown from "@/components/admin-components/EventCategoryDropdown";
import TitleSection from "@/components/common/TitleSection";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";

function DropdownPage() {
  const [activeTab, setActiveTab] = useState<"ticket-type" | "event-category">(
    "ticket-type"
  );

  const renderTabSection = () => {
    switch (activeTab) {
      case "ticket-type":
        return <TicketTypeDropdown />;
      case "event-category":
        return <EventCategoryDropdown />;
      default:
        return <></>;
    }
  };

  return (
    <div className="px-8 py-5">
      <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.DROPDOWN.MAIN_PAGE} />
      <ChartCard>
        <TitleSection title="Dropdowns" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-0 md:border-b  border-gray-200">
          <div className="relative space-x-4 flex w-full md:w-auto">
            {["ticket-type", "event-category"].map((tab: string) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "ticket-type" | "event-category")
                }
                className={`relative pb-5 pt-7 px-2 text-sm md:text-base font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            ))}
          </div>
        </div>
        {renderTabSection()}
      </ChartCard>
    </div>
  );
}

export default DropdownPage;
