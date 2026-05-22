import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async (status = "") => {
  try {
    const url = status
      ? `/applications/my?status=${status}`
      : "/applications/my";

    const response = await API.get(url);
    setApplications(response.data);
  } catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to Load Applications";

  toast.error(message);
}
};

//   const loadApplications = async () => {
//     try {
//       const response = await API.get("/applications/my");
//       console.log("APPLICATIONS RESPONSE:", response.data);
//       setApplications(response.data);
//     } catch (error) {
//       console.error("APPLICATIONS ERROR:", error.response?.data || error.message);
//       alert("Failed to load applications");
//     }
//   };

  return (
    <div>
        <Navbar />
      <h2>My Applications</h2>
      <button onClick={() => loadApplications("")}>All</button>
      <button onClick={() => loadApplications("APPLIED")}>Applied</button>
      <button onClick={() => loadApplications("REVIEWED")}>Reviewed</button>
      <button onClick={() => loadApplications("SHORTLISTED")}>Shortlisted</button>
      <button onClick={() => loadApplications("SELECTED")}>Selected</button>
      <button onClick={() => loadApplications("REJECTED")}>Rejected</button>

      <button onClick={() => (window.location.href = "/jobs")}>
        Back to Jobs
      </button>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id}>
            <p>Application ID: {app.id}</p>
            <p>Job ID: {app.jobId}</p>
            <p>Status: {app.status}</p>
            <p>Applied Date: {app.appliedDate}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
  
}

export default MyApplicationsPage;