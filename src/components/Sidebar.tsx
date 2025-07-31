"use client";

import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  radius: number; // Add radius to the props
  setRadius: (value: number) => void; // Add setRadius to the props
}

const Sidebar = ({ isOpen, onToggle, radius, setRadius }: SidebarProps) => {
  return (
    <>
      {/* Toggle button for the sidebar */}
      <button
        onClick={onToggle}
        className={`
          fixed top-5 z-[1001] border-none bg-white py-2 px-4 cursor-pointer 
          rounded-r-lg shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? 'left-80' : 'left-5'}
        `}
      >
        {isOpen ? "◀ Hide" : "▶ Show"}
      </button>

      {/* Sidebar container */}
      <div
        className={`
          w-80 h-screen bg-white fixed top-0 left-0 shadow-lg z-50 p-6 
          overflow-y-auto transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <h2 className="mb-6 text-xl font-bold">Open Mic Search</h2>
        
        {/* Search bar section */}
        <div className="mb-6">
          <label htmlFor="location-search" className="block font-semibold mb-1">
            Location:
          </label>
          <input
            id="location-search"
            type="text"
            placeholder="Enter a city or address..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Radius slider section */}
        <div className="mb-6">
          <label htmlFor="radius-slider" className="block font-semibold mb-1">
            Radius: <span className="font-normal">{radius} miles</span>
          </label>
          <input
            id="radius-slider"
            type="range"
            min="0"
            max="100"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* List of open mics (placeholder) */}
        <div>
          <h3 className="mb-2 text-lg font-bold">Results:</h3>
          <ul className="list-none p-0 m-0">
            <li className="p-2 border-b border-gray-200">The Comedy Cellar</li>
            <li className="p-2 border-b border-gray-200">Bluebird Cafe Songwriter Night</li>
            <li className="p-2 border-b border-gray-200">Nuyorican Poets Cafe</li>
            <li className="p-2 border-b border-gray-200">The Laugh Factory Open Mic</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;