import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const success = await forgotPassword(values.email);

    if (success) {
      resetForm();
      setSuccess(true);
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="card bg-blue-50 border border-blue-200">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-blue-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Reset Email Sent!
              </h2>
              <p className="text-blue-700 mb-4">
                If your email is registered, we've sent a link to reset your
                password. Please check your inbox.
              </p>
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
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Reset Password!</h1>
            <p className="text-slate-600">
              Enter your email to reset your password
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="form-error"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Confirm"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-slate-600">
                    <Link to="/login" className="text-primary hover:underline">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
