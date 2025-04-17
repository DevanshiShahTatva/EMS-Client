import React from "react";

// library imports
import Link from "next/link";
import Image from "next/image";

// images path
import CrossIconPath from "../../../public/assets/CrossIcon.svg"

// constant support
import { ADMIN_SIDEBAR_ITEMS } from "@/utils/constant";

// types import
import { ISidebarPageProps } from "@/utils/types";

const Sidebar: React.FC<ISidebarPageProps> = ({ children, isOpen, onClose, activeLink = "" }) => {

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div className="flex min-h-[calc(100vh-82px)]">
        {/* Sidebar */}
        <div className={"md:flex flex-col md:w-64 sm:w-0"}>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div
              className={`fixed z-40 md:static md:translate-x-0 top-0 left-0 h-full w-full transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out`}
            >
              <nav className="flex flex-col p-4">
                <div
                  onClick={onClose}
                  className={`${
                    isOpen ? "block" : "hidden"
                  } md:hidden flex justify-end`}
                >
                  <Image
                    src={CrossIconPath}
                    alt="cross-icon"
                    width={40}
                    height={40}
                    className="font-bold"
                  />
                </div>
                {ADMIN_SIDEBAR_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    href={item.route}
                    onClick={onClose}
                    className={`flex items-center rounded-xl px-4 py-3 my-2 font-bold text-gray-700  hover:bg-blue-200 ${
                      activeLink.includes(item.route) && "bg-blue-200"
                    }`}
                  >
                    <div className="flex gap-1">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        height={24}
                        width={24}
                        className="mr-2"
                      />

                      <p>{item.title}</p>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto"> {children}</div>
      </div>
    </>
  );
};
 
export default Sidebar;
