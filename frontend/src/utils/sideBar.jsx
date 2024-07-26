import React from "react";
import { RiMenu2Line, RiHomeLine, RiVideoLine, RiHistoryLine, RiPlayListLine, RiUserLine, RiSettings3Line } from "react-icons/ri";

export default function SideBar({ sidebarOpen }) {

    return(
        <aside
        className={`fixed top-16 left-0 h-[calc(100%-64px)] bg-gradient-to-b from-gray-800 to-gray-900 p-6 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-20 w-64 md:w-80 flex flex-col justify-between shadow-lg border-r border-gray-700`}
      >
        <div>
          <ul className="space-y-6">
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiHomeLine size={24} className="mr-3" />
                Home
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiVideoLine size={24} className="mr-3" />
                Liked Videos
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiHistoryLine size={24} className="mr-3" />
                History
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiPlayListLine size={24} className="mr-3" />
                My Content
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiPlayListLine size={24} className="mr-3" />
                Collections
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200">
                <RiUserLine size={24} className="mr-3" />
                Subscribers
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button className="w-full flex items-center justify-center text-center hover:bg-gray-700 p-3 rounded-lg text-lg mt-2 transition-colors duration-200">
            <RiSettings3Line size={24} className="mr-3" />
            Settings
          </button>
        </div>
      </aside>
    )
}
