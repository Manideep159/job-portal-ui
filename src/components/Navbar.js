import { useEffect, useState } from "react";



function Navbar() {


  const role = localStorage.getItem("role");
  
  const [darkMode, setDarkMode] = useState(false);

   const toggleDarkMode = () => {

  const newMode = !darkMode;

  setDarkMode(newMode);

  if (newMode) {
    document.body.style.backgroundColor = "#111827";
    document.body.style.color = "white";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
};

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
 
    
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand" href="/jobs">
        Job Portal
      </a>

      <div className="ms-auto">
        <button
            className="btn btn-secondary me-2"
            onClick={toggleDarkMode}
>           {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
           className="btn btn-outline-info me-2"
           onClick={() => (window.location.href = "/profile")}
>
             Profile
         </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => (window.location.href = "/jobs")}
        >
          Jobs
        </button>

        <button
         className="btn btn-outline-info me-2"
         onClick={() => (window.location.href = "/saved-jobs")}
>
             Saved Jobs
</button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => (window.location.href = "/my-applications")}
        >
          My Applications
        </button>

            {role === "ROLE_ADMIN" && (
        <button
           className="btn btn-outline-warning me-2"
          onClick={() => (window.location.href = "/admin-dashboard")}
  >
            Admin Dashboard
        </button>
)}

        {/* <button
          className="btn btn-outline-warning me-2"
          onClick={() => (window.location.href = "/admin-dashboard")}
        >
          Admin Dashboard
          
        </button> */}

        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;