import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function ProfilePage() {

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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