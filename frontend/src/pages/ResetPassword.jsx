import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../context/AuthContext";

const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get token from URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  if (!token) {
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
                Invalid Reset Link
              </h2>
              <p className="text-red-700 mb-4">
                The password reset link is invalid or has expired. Please
                request a new password reset.
              </p>
              <Link
                to="/forgot-password"
                className="btn btn-primary inline-block"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Initial form values
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("");
    const success = await resetPassword(token, values.password);

    if (success) {
      setSuccess(true);
      // Navigate to login after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }

    setSubmitting(false);
  };

  if (success) {
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
                Password Reset Successful!
              </h2>
              <p className="text-green-700 mb-4">
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
              <Link to="/login" className="btn btn-primary inline-block">
                Go to Login
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
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">New Password</h1>
            <p className="text-slate-600">
              Create a new password for your account
            </p>
          </div>

          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="form-error"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
                >
                  {isSubmitting ? "Resetting..." : "Confirm"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
