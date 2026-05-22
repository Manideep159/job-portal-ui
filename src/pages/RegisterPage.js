import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function RegisterPage() {
  const [formData, setFormData] = useState({
    mobile: "",
    userName: "",
    email: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (
      !formData.mobile ||
      !formData.userName ||
      !formData.email ||
      !formData.location
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", formData);

      toast.success("Registered successfully. Please login.");

      window.location.href = "/";
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-4">Register</h2>

        <input
          className="form-control mb-3"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) =>
            setFormData({ ...formData, mobile: e.target.value })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Name"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        <button
          className="btn btn-success w-100"
          onClick={register}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-3">
          Already registered?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;