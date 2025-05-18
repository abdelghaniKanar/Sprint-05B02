import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Loading from "../components/layout/Loading";

const ConfirmUpdate = () => {
  const { confirmSensitiveUpdate } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [field, setField] = useState("");

  // Get token and field from URL query parameters
  const token = new URLSearchParams(location.search).get("token");
  const fieldParam = new URLSearchParams(location.search).get("field");

  useEffect(() => {
    const confirmUpdate = async () => {
      if (!token || !fieldParam) {
        setError("Invalid confirmation link. Please request a new update.");
        setLoading(false);
        return;
      }

      setField(fieldParam);

      try {
        const success = await confirmSensitiveUpdate(fieldParam, token);
        setSuccess(success);
      } catch (err) {
        setError(
          "There was an error confirming your update. Please try again later."
        );
      }

      setLoading(false);
    };

    confirmUpdate();
  }, [token, fieldParam, confirmSensitiveUpdate]);

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
                Update Confirmation Failed
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Link to="/profile" className="btn btn-primary inline-block">
                Back to Profile
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
              Update Confirmed!
            </h2>
            <p className="text-green-700 mb-4">
              Your {field} has been updated successfully.
            </p>
            <Link to="/profile" className="btn btn-primary inline-block">
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUpdate;
