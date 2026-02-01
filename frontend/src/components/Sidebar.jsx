export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">
        AI Legal System
      </h2>

      <button className="w-full bg-gray-800 p-2 rounded mb-2">
        + New Case
      </button>

      <div className="mt-4 space-y-2">
        <div className="bg-gray-800 p-2 rounded">
          Case 1
        </div>
        <div className="bg-gray-800 p-2 rounded">
          Case 2
        </div>
      </div>
    </div>
  );
}
