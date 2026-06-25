import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function ProfilePage() {

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
 

const [formData, setFormData] = useState({
  userName: "",
  email: "",
  location: ""
});

  useEffect(() => {
    loadProfile();
      }, []);

  const loadProfile = async () => {

    try {

      const response = await API.get("/users/profile");

      setProfile(response.data);
       setFormData({
      userName: response.data.userName || "",
      email: response.data.email || "",
      location: response.data.location || ""
    });

    } catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to Load Profile";

  toast.error(message);
}
  };
//   const updateProfile = async () => {

//   try {

//     await API.put(
//       "/users/profile",
//       formData
//     );

//     alert("Profile updated");

//        setEditing(false);

//        loadProfile();

//   } catch (error) {

//     console.error(
//        error.response?.data || error.message
//     );

//        alert("Failed to update profile");
//   }
// };
const updateProfile = async () => {
  try {
    setSaving(true);

    await API.put("/users/profile", formData);

    toast.success("Profile updated successfully");

    setEditing(false);

    loadProfile();
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update profile";

    toast.error(message);
  } finally {
    setSaving(false);
  }
};

  if (!profile) {
   return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <p>Loading profile...</p>
      </div>
    </div>
  );
  }
  const uploadResume = async () => {

  if (!resume) {
    toast.error("Please select a resume");
    return;
  }

  try {

    setUploadingResume(true);

    const formData = new FormData();

    formData.append("resume", resume);

    await API.post(
      "/users/profile/upload-resume",
      formData
    );

    toast.success("Resume uploaded successfully");

    loadProfile();

  } catch (error) {

    console.error(error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Resume upload failed";

    toast.error(message);

  } finally {

    setUploadingResume(false);

  }
};
//   const uploadResume = async () => {

//   if (!resume) {
//     toast.error("Please select a resume");
//     return;
//   }

//   try {

//     setUploadingResume(true);

//     const formData = new FormData();

//     formData.append(
//       "resume",
//       resume
//     );

//     await API.post(
//       "/users/profile/upload-resume",
//       formData,
//       {
//         headers: {
//           "Content-Type":
//             "multipart/form-data"
//         }
//       }
//     );

//     toast.success(
//       "Resume uploaded successfully"
//     );

//     loadProfile();

//   } catch (error) {

//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "Resume upload failed";

//     toast.error(message);

//   } finally {

//     setUploadingResume(false);
//   }
// };

  return (

    <div>

      <Navbar />

      <div className="container mt-4">

        <div className="card shadow p-4">

          <h2>User Profile</h2>

          <hr />

          <p>
            <strong>Mobile:</strong> {profile.mobile}
          </p>
        
          <p>
         <strong>Name:</strong> {profile.userName}
          </p>

          <p>
         <strong>Email:</strong> {profile.email}
          </p>

          <p>
         <strong>Location:</strong> {profile.location}
          </p>

          <p>
            <strong>Role:</strong> {profile.role}
          </p>

          <p>
            <strong>Total Applications:</strong>
            {" "}
            {profile.totalApplications}
          </p>

         
          <p>
            <strong>Saved Jobs:</strong>
            {" "}
            {profile.savedJobs}
          </p>

        <hr />

<h5>Resume</h5>

<input
  type="file"
  className="form-control mb-3"
  accept=".pdf,.doc,.docx"
  onChange={(e) =>
    setResume(e.target.files[0])
  }
/>

<button
  className="btn btn-primary me-2"
  onClick={uploadResume}
  disabled={uploadingResume}
>
  {uploadingResume
    ? "Uploading..."
    : "Upload Resume"}
</button>

{profile.resumePath && (
  <div className="mt-3">
    <a
      href={`https://job-portal-backend-9ia9.onrender.com/uploads/${profile.resumePath}`}
      target="_blank"
      rel="noreferrer"
      className="btn btn-success"
    >
      View Resume
    </a>
  </div>
)}

         <button
    className="btn btn-primary mt-3"
    onClick={() => setEditing(!editing)}
  >
    {editing ? "Cancel" : "Edit Profile"}
  </button>

  {editing && (

    <div className="mt-4">

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Username"
        value={formData.userName}
        onChange={(e) =>
          setFormData({
            ...formData,
            userName: e.target.value
          })
        }
      />

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value
          })
        }
      />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Location"
        value={formData.location}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: e.target.value
          })
        }
      />

      <button
         className="btn btn-success"
         onClick={updateProfile}
         disabled={saving}
>
         {saving ? "Saving..." : "Save Changes"}
</button>

    </div>
  )}
        </div>

      </div>

    </div>
  );
}

export default ProfilePage;