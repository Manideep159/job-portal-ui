import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function AdminDashboardPage() {

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  
  useEffect(() => {

  loadApplications();
  loadStats();
  }, []);

  const loadApplications = async () => {

    try {

      const response = await API.get("/admin/applications");

      setApplications(response.data);

    } catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to Load Admin Applications";

  toast.error(message);
}
  };

 const loadStats = async () => {
  try {
    const response = await API.get("/admin/stats");
  
    // console.log("ADMIN STATS:", response.data);

    setStats(response.data);
  } 
  catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to Load Stats";

  toast.error(message);
}
};
const chartData = [
  { name: "Applied", value: stats.APPLIED || 0 },
  { name: "Reviewed", value: stats.REVIEWED || 0 },
  { name: "Shortlisted", value: stats.SHORTLISTED || 0 },
  { name: "Selected", value: stats.SELECTED || 0 },
  { name: "Rejected", value: stats.REJECTED || 0 }
];

const COLORS = [
  "#2563eb",
  "#f59e0b",
  "#9333ea",
  "#16a34a",
  "#dc2626"
];

const updateStatus = async (id, status) => {
  try {
    setUpdatingId(id);

    await API.put(`/admin/applications/${id}/status?status=${status}`);

    toast.success("Status updated");

    loadApplications();
    loadStats();
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update status";

    toast.error(message);
  } finally {
    setUpdatingId(null);
  }
};
const viewResume = (resumePath) => {
  try {

    // const response = await API.get(
    //   `/admin/applications/${applicationId}/resume`,
    //   {
    //     responseType: "blob",
    //   }
    // );
    // window.open(
    //     `${process.env.REACT_APP_API_URL}/uploads/${resumePath}`,
    //     "_blank"
    // );

    window.open(profile.resumePath, "_blank");

    // const blob = new Blob(
    //   [response.data],
    //   { type: "application/pdf" }
    // );

    // const fileURL =
    //   window.URL.createObjectURL(blob);

    // window.open(fileURL);

  } catch (error) {

    console.error(error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to open resume";

    toast.error(message);
  }
};

  return (
    <div>
        <Navbar />

      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>

  <div style={cardStyle}>
    <h3>Total</h3>
    <p>{stats.TOTAL || 0}</p>
  </div>

  <div style={cardStyle}>
    <h3>Applied</h3>
    <p>{stats.APPLIED || 0}</p>
  </div>

  <div style={cardStyle}>
    <h3>Reviewed</h3>
    <p>{stats.REVIEWED || 0}</p>
  </div>

  <div style={cardStyle}>
    <h3>Shortlisted</h3>
    <p>{stats.SHORTLISTED || 0}</p>
  </div>

  <div style={cardStyle}>
    <h3>Selected</h3>
    <p>{stats.SELECTED || 0}</p>
  </div>

  <div style={cardStyle}>
    <h3>Rejected</h3>
    <p>{stats.REJECTED || 0}</p>
  </div>

</div>
<div style={{ marginBottom: "40px" }}>

  <h3>Application Analytics</h3>

  <PieChart width={400} height={300}>

    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      outerRadius={100}
      dataKey="value"
      label
    >

      {chartData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
        />
      ))}

    </Pie>

    <Tooltip />

    <Legend />

  </PieChart>

</div>

      {applications.map((app) => (

        <div key={app.id}>

          <h3>{app.jobTitle}</h3>

          <p>{app.company}</p>

          <p>{app.location}</p>

          <p>User: {app.userMobile}</p>

          <p>Status: {app.status}</p>

          <button
            className="btn btn-warning me-2"
            disabled={updatingId === app.id}
            onClick={() => updateStatus(app.id, "REVIEWED")}
            
          >
            REVIEWED
          </button>

          <button
             className="btn btn-warning me-2"
            disabled={updatingId === app.id}
            onClick={() => updateStatus(app.id, "SHORTLISTED")}
          >
            SHORTLISTED
          </button>

          <button
            className="btn btn-warning me-2"
            disabled={updatingId === app.id}
            onClick={() => updateStatus(app.id, "SELECTED")}
          >
            SELECTED
          </button>

          <button
            className="btn btn-danger"
            disabled={updatingId === app.id}
            onClick={() => updateStatus(app.id, "REJECTED")}
          >
            REJECTED
          </button>
   {app.resumePath ? (
    <button
        className="btn btn-success"
        onClick={() => viewResume(app.resumePath)}
        //     window.open(
        //         `https://job-portal-backend-9ia9.onrender.com/uploads/${app.resumePath}`,
        //         "_blank"
        //     )
        // }
    >
        ViewResume
    </button>
) : (
    <span>No Resume</span>
)}

          <hr />

        </div>
      ))}

    </div>
  );
}
const cardStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "120px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};


export default AdminDashboardPage;