import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);


  const loadJobs = useCallback(async () => {
  try {
    const response = await API.get(`/jobs/page?page=${page}&size=5`);
    setJobs(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to load jobs";

    toast.error(message);
  }
}, [page]);
   useEffect(() => {
    loadJobs();
  }, [loadJobs]);

 const saveJob = async (jobId) => {
  try {
    setSavingJobId(jobId);

    await API.post(`/jobs/save/${jobId}`);

    toast.success("Job saved");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to save job";

    toast.error(message);
  } finally {
    setSavingJobId(null);
  }
};


//     const applyJob = async (jobId) => {
//   try {
//     setApplyingJobId(jobId);

//     const response = await API.post(`/applications/${jobId}`);

//     toast.success("Application saved. Redirecting to official site...");

//     if (response.data.applyLink) {
//       window.open(response.data.applyLink, "_blank");
//     }
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "Failed to apply";

//     toast.error(message);
//   } finally {
//     setApplyingJobId(null);
//   }
// };
  
 const applyJob = async (jobId) => {

  if (!selectedResume) {
    toast.error("Please upload resume");
    return;
  }

  try {

    setApplyingJobId(jobId);

    const formData = new FormData();

    formData.append(
      "resume",
      selectedResume
    );

    const response = await API.post(
      `/applications/${jobId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      "Application submitted successfully"
    );

    if (response.data.applyLink) {
      window.open(
        response.data.applyLink,
        "_blank"
      );
    }

  } catch (error) {

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to apply";

    toast.error(message);

  } finally {

    setApplyingJobId(null);
  }
};

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      jobTypeFilter === "" ? true : job.type === jobTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">Available Jobs</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mb-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setJobTypeFilter("")}
          >
            All
          </button>

          <button
            className="btn btn-primary me-2"
            onClick={() => setJobTypeFilter("GOVT")}
          >
            Govt
          </button>

          <button
            className="btn btn-success"
            onClick={() => setJobTypeFilter("PRIVATE")}
          >
            Private
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">{job.title}</h4>

                <p>
                  <strong>Company:</strong> {job.company}
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Description:</strong> {job.description}
                </p>

                <span
                  className={
                    job.type === "GOVT"
                      ? "badge bg-primary"
                      : "badge bg-success"
                  }
                >
                  {job.type}
                </span>

                <br />
                <br />

                <button
                  className="btn btn-warning me-2"
                  onClick={() => saveJob(job.id)}
                  disabled={savingJobId === job.id}
>
                  {savingJobId === job.id ? "Saving..." : "Save"}
                 </button>
                 <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                    setSelectedResume(e.target.files[0])
  }
/>

                <button
                  className="btn btn-dark"
                  onClick={() => applyJob(job.id)}
                  disabled={applyingJobId === job.id}
                >
                   {applyingJobId === job.id ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
          ))
        )}

        <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
          <button
            className="btn btn-outline-dark me-3"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            className="btn btn-outline-dark ms-3"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;