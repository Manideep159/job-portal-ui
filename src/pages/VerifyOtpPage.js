import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const mobile = localStorage.getItem("mobile");

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    if (otp.length !== 4) {
      toast.error("OTP must be 4 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/verify-otp", {
        mobile: mobile,
        otp: otp,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      toast.success("Login successful");

      window.location.href = "/jobs";
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid OTP";

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
        <h2 className="text-center mb-4">Verify OTP</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              verifyOtp();
            }
          }}
        />

        <button
          className="btn btn-success w-100"
          onClick={verifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOtpPage;