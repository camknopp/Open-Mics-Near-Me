import { useState } from "react";
import { DayOfWeek, Genre } from "@/generated/prisma";

interface AddOpenMicFormProps {
  isShowing: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const AddOpenMicForm = ({
  isShowing,
  onClose,
  latitude,
  longitude,
}: AddOpenMicFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    title: "",
    dayOfWeek: [] as DayOfWeek[],
    startTime: "",
    endTime: "",
    hostName: "",
    hostWebsite: "",
    description: "",
    genre: [] as Genre[],
    equipment: "",
    signupMethod: "",
    rules: "",
    venueName: "",
    venueAddress: "",
    venueWebsite: "",
    venueFacebook: "",
    venueInstagram: "",
  });

  // Handle form input changes for text and time inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle selection of enum values
  const handleEnumToggle = (enumName: "dayOfWeek" | "genre", value: string) => {
    setFormData((prevData) => {
      if (enumName === "dayOfWeek") {
        const dayValue = value as DayOfWeek;
        const currentList = prevData.dayOfWeek;
        const newDays = currentList.includes(dayValue)
          ? currentList.filter((item) => item !== dayValue)
          : [...currentList, dayValue];
        return { ...prevData, dayOfWeek: newDays };
      } else {
        // enumName is "genre"
        const genreValue = value as Genre;
        const currentList = prevData.genre;
        const newGenres = currentList.includes(genreValue)
          ? currentList.filter((item) => item !== genreValue)
          : [...currentList, genreValue];
        return { ...prevData, genre: newGenres };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Construct the payload to ensure correct data types
      const payload = {
        ...formData,
        // Explicitly convert latitude and longitude to numbers if they aren't already
        // This is a common point of failure if they come from a string input
        latitude: Number(latitude),
        longitude: Number(longitude),
      };

      // Log the payload to the browser console to verify the data structure
      console.log("Submitting payload:", payload);

      const response = await fetch("/api/openmics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save open mic.");
      }

      const result = await response.json();
      console.log("Open mic saved successfully:", result);
      setSuccess("Open mic saved successfully!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error saving open mic:", error);
      // The previous error was a SyntaxError. A server error is now a 500.
      // The `await response.json()` is failing because it's not JSON.
      // Let's log the full response text instead to see the HTML error page.
      if (error instanceof SyntaxError) {
        console.error(
          "Received non-JSON response from server. Check server logs for details."
        );
        // You can also try to read the raw text of the response if available
        // e.g., const text = await response.text(); console.error(text);
        setError("An unexpected server error occurred. Please try again.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render nothing if the form is not showing
  if (!isShowing) return null;

  return (
    <div className="fixed top-0 right-0 z-[1002] h-screen w-96 overflow-y-auto rounded-l-lg bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Add Open Mic</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          aria-label="Close form"
        >
          X
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* UI Feedback for the user */}
        {error && (
          <div className="p-3 text-sm font-medium text-red-800 rounded-md bg-red-50">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm font-medium text-green-800 rounded-md bg-green-50">
            {success}
          </div>
        )}

        {/* Venue Details Section */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">Venue Details</h3>
          {/* Venue Name */}
          <div>
            <label
              htmlFor="venueName"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Name
            </label>
            <input
              type="text"
              id="venueName"
              name="venueName"
              value={formData.venueName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Venue Address */}
          <div>
            <label
              htmlFor="venueAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Address
            </label>
            <input
              type="text"
              id="venueAddress"
              name="venueAddress"
              value={formData.venueAddress}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Venue Website */}
          <div>
            <label
              htmlFor="venueWebsite"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Website
            </label>
            <input
              type="url"
              id="venueWebsite"
              name="venueWebsite"
              value={formData.venueWebsite}
              onChange={handleInputChange}
              placeholder="https://"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Venue Facebook */}
          <div>
            <label
              htmlFor="venueFacebook"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Facebook
            </label>
            <input
              type="url"
              id="venueFacebook"
              name="venueFacebook"
              value={formData.venueFacebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Venue Instagram */}
          <div>
            <label
              htmlFor="venueInstagram"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Instagram
            </label>
            <input
              type="url"
              id="venueInstagram"
              name="venueInstagram"
              value={formData.venueInstagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Days of the Week */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Day(s) of the Week
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.values(DayOfWeek).map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => handleEnumToggle("dayOfWeek", day)}
                className={`
                  rounded-full px-3 py-1 cursor-pointer text-xs font-semibold uppercase transition-colors
                  ${
                    formData.dayOfWeek.includes(day)
                      ? "bg-blue-500 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time (Start & End) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <div className="mt-1 flex gap-4">
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="self-center">-</span>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Host Name */}
        <div>
          <label
            htmlFor="hostName"
            className="block text-sm font-medium text-gray-700"
          >
            Host Name
          </label>
          <input
            type="text"
            id="hostName"
            name="hostName"
            value={formData.hostName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Host Website */}
        <div>
          <label
            htmlFor="hostWebsite"
            className="block text-sm font-medium text-gray-700"
          >
            Host Website
          </label>
          <input
            type="url"
            id="hostWebsite"
            name="hostWebsite"
            value={formData.hostWebsite}
            onChange={handleInputChange}
            placeholder="https://"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Genre(s)
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.values(Genre).map((genre) => (
              <button
                type="button"
                key={genre}
                onClick={() => handleEnumToggle("genre", genre)}
                className={`
                  rounded-full px-3 py-1 text-xs font-semibold uppercase cursor-pointer transition-colors
                  ${
                    formData.genre.includes(genre)
                      ? "bg-purple-500 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-purple-200"
                  }
                `}
              >
                {genre.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label
            htmlFor="equipment"
            className="block text-sm font-medium text-gray-700"
          >
            Equipment
          </label>
          <input
            type="text"
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleInputChange}
            placeholder="e.g., PA, 2 Mics, Full Backline"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Signup Method */}
        <div>
          <label
            htmlFor="signupMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Signup Method
          </label>
          <input
            type="text"
            id="signupMethod"
            name="signupMethod"
            value={formData.signupMethod}
            onChange={handleInputChange}
            placeholder="e.g., At Door, Online Pre-signup"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Rules */}
        <div>
          <label
            htmlFor="rules"
            className="block text-sm font-medium text-gray-700"
          >
            Rules
          </label>
          <textarea
            id="rules"
            name="rules"
            rows={3}
            value={formData.rules}
            onChange={handleInputChange}
            placeholder="e.g., 3 song max, 5 min limit"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-green-600 p-2 font-semibold text-white shadow-sm hover:bg-green-700"
        >
          {isLoading ? "Saving..." : "Save Open Mic"}
        </button>
      </form>
    </div>
  );
};

export default AddOpenMicForm;
