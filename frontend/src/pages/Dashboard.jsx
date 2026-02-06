import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "20px", flex: 1 }}>
        <h2>Upload Case Documents</h2>
        <input type="file" />
      </div>

    </div>
  );
}

export default Dashboard;
