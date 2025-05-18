import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Loading from "../components/layout/Loading";

const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get token from URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError(
          "Invalid verification link. Please request a new verification email."
        );
        setLoading(false);
        return;
      }

      try {
        const success = await verifyEmail(token);
        setSuccess(success);
      } catch (err) {
        setError(
          "There was an error verifying your email. Please try again later."
        );
      }

      setLoading(false);
    };

    verifyToken();
  }, [token, verifyEmail]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="card bg-red-50 border border-red-200">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Link to="/login" className="btn btn-primary inline-block">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="card bg-green-50 border border-green-200">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Email Verified!
            </h2>
            <p className="text-green-700 mb-4">
              Your email has been verified successfully. You can now log in to
              your account.
            </p>
            <Link to="/login" className="btn btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
