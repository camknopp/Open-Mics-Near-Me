"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import AddOpenMicForm from "@/components/AddOpenMicForm"

const LazyMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const defaultPosition: [number, number] = [40.7128, -74.006];
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOpenMicForm, setShowOpenMicForm] = useState(false);
  const [radius, setRadius] = useState(2);
  const zoom = 13;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred while getting location.");
            break;
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const handleSearchSubmit = useCallback(async (query: string) => {
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setPosition(newPosition);
        // Do not update the `initialPosition` prop of the map here.
        // Instead, the `LocationMarkerAndCircle` component should react to the `position` state.
      } else {
        setError(`No results found for "${query}". Using current location.`);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to get location from search. Please try again.");
    }
  }, []);

  const handleAddOpenMic = () => {
    // This function will be called when the button is clicked.
    // The 'position' state from Home.tsx holds the current marker location.
    console.log("Add open mic button clicked at:", position);
    setShowOpenMicForm(true)
    // Add more logic here later, like opening a form.
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Getting your location...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-screen relative overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        radius={radius}
        setRadius={setRadius}
        onSearchSubmit={handleSearchSubmit}
        onOpenMicForm={handleAddOpenMic}
      />
      <AddOpenMicForm
        isShowing={showOpenMicForm}
        onClose={() => setShowOpenMicForm(false)}
        latitude={position[0]}
        longitude={position[1]}
      />
      <div
        className={`
          flex-grow transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? "ml-80" : "ml-0"}
        `}
      >
        {error && (
          <div className="absolute top-4 left-4 right-4 z-40 p-4 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
            <p>
              <strong className="font-semibold">Location Error:</strong> {error}
            </p>
            <p>Using default location instead.</p>
          </div>
        )}
        <LazyMap position={position} zoom={zoom} radius={radius} />
      </div>
    </main>
  );
}
