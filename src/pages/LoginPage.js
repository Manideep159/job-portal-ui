import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!mobile) {
      toast.error("Mobile number is required");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      await API.post(`/auth/send-otp?mobile=${mobile}`);

      toast.success("OTP sent successfully");

      localStorage.setItem("mobile", mobile);

      window.location.href = "/verify-otp";
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send OTP";

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
          width: "400px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendOtp();
            }
          }}
        />

        <button
          className="btn btn-primary w-100"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="text-center mt-3">
          New user?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => (window.location.href = "/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;