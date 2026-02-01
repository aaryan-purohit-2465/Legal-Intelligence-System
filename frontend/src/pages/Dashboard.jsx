import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Upload Case Documents
        </h1>

        <input
          type="file"
          className="mt-4"
        />
      </div>
    </div>
  );
}
