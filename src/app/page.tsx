export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-brand-primary mb-4">
        Open Mic Map
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Find and share open mics near you.
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-300">
        Discover Mics
      </button>
    </div>
  );
}