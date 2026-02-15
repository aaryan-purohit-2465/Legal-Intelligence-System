import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [file, setFile] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const uploadCase = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "123");

    const res = await API.post("/cases/upload", formData);
    alert("Case uploaded");
  };

  const handleSelectCase = (caseData) => {
    setSelectedCase(caseData);
  };

  const chartData = selectedCase?.insights?.frequency
    ? {
        labels: Object.keys(selectedCase.insights.frequency),
        datasets: [
          {
            label: "Keyword Frequency",
            data: Object.values(selectedCase.insights.frequency),
            backgroundColor: "rgba(75,192,192,0.6)"
          }
        ]
      }
    : null;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onSelectCase={handleSelectCase} />

      <div style={{ padding: "20px", flex: 1 }}>
        <h2>Upload Case Document</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadCase}>
          Upload
        </button>

        {selectedCase && (
          <>
            <hr />

            <h3>Selected Case</h3>
            <p><strong>File:</strong> {selectedCase.filename}</p>

            <h4>AI Summary</h4>
            <p style={{ background: "#eee", padding: "10px" }}>
              {selectedCase.insights.summary}
            </p>

            <h4>Top Keywords</h4>
            <div style={{ marginBottom: "20px" }}>
              {selectedCase.insights.keywords.map((word, index) => (
                <span
                  key={index}
                  style={{
                    background: "#222",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    marginRight: "8px",
                    fontSize: "12px"
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {chartData && (
              <>
                <h4>Keyword Frequency Chart</h4>
                <Bar data={chartData} />
              </>
            )}

            <h4>Extracted Text</h4>
            <div style={{
              background: "#f4f4f4",
              padding: "15px",
              maxHeight: "300px",
              overflowY: "scroll"
            }}>
              {selectedCase.extractedText}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
