import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const response = await API.get("/jobs/saved");
      setJobs(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to load saved jobs");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h2>Saved Jobs</h2>

        {jobs.length === 0 ? (
          <p>No saved jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h4>{job.title}</h4>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <span className={job.type === "GOVT" ? "badge bg-primary" : "badge bg-success"}>
                  {job.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedJobsPage;