"use client";

import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  radius: number;
  setRadius: (value: number) => void;
  onSearchSubmit: (query: string) => void;
  onOpenMicForm: () => void;
}

const Sidebar = ({ isOpen, onToggle, radius, setRadius, onSearchSubmit, onOpenMicForm: onAddOpenMic }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <>
      {/* Toggle button for the sidebar */}
      <button
        onClick={onToggle}
        className={`
          fixed top-5 z-[1001] border-none bg-white py-2 px-4 cursor-pointer 
          rounded-r-lg shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? "left-80" : "left-5"}
        `}
      >
        {isOpen ? "◀ Hide" : "▶ Show"}
      </button>

      {/* Sidebar container */}
      <div
        className={`
          w-80 h-screen bg-white fixed top-0 left-0 shadow-lg z-50 p-6 
          overflow-y-auto transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <h2 className="mb-6 text-xl font-bold">Open Mics Near Me</h2>

        {/* Search bar section */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit}>
            <label
              htmlFor="location-search"
              className="block font-semibold mb-1"
            >
              Location:
            </label>
            <input
              id="location-search"
              type="text"
              placeholder="Enter a city or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-blue-500 cursor-pointer text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Radius slider section */}
        <div className="mb-6">
          <label htmlFor="radius-slider" className="block font-semibold mb-1">
            Radius: <span className="font-normal">{radius} miles</span>
          </label>
          <input
            id="radius-slider"
            type="range"
            min="1"
            max="25"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

         {/* Button to add an open mic */}
        <div className="mb-6">
          <button
            onClick={onAddOpenMic}
            className="w-full bg-green-500 text-white p-2 rounded-md font-semibold cursor-pointer hover:bg-green-600 transition-colors"
          >
            + Add Open Mic Here
          </button>
        </div>

        {/* List of open mics (placeholder) */}
        <div>
          <h3 className="mb-2 text-lg font-bold">Results:</h3>
          <ul className="list-none p-0 m-0">
            <li className="p-2 border-b border-gray-200">The Comedy Cellar</li>
            <li className="p-2 border-b border-gray-200">
              Bluebird Cafe Songwriter Night
            </li>
            <li className="p-2 border-b border-gray-200">
              Nuyorican Poets Cafe
            </li>
            <li className="p-2 border-b border-gray-200">
              The Laugh Factory Open Mic
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
