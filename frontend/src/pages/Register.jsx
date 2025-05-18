import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    nickname: Yup.string()
      .min(3, "Nickname must be at least 3 characters")
      .max(30, "Nickname must be less than 30 characters")
      .required("Nickname is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Initial form values
  const initialValues = {
    nickname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError("");
    const success = await register(values);

    if (success) {
      resetForm();
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
                Registration Successful!
              </h2>
              <p className="text-green-700 mb-4">
                Please check your email to verify your account. You will be
                redirected to the login page in a few seconds.
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
            <h1 className="text-2xl font-bold mb-2">Créer un Compte</h1>
            <p className="text-slate-600">Create your account to get started</p>
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
                  <label htmlFor="nickname" className="form-label">
                    Nickname
                  </label>
                  <Field
                    type="text"
                    id="nickname"
                    name="nickname"
                    className="form-input"
                    placeholder="Enter your nickname"
                  />
                  <ErrorMessage
                    name="nickname"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="form-label">
                    Nom d'utilisateur
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="form-error"
                  />
                </div>

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

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
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
                    placeholder="Confirm your password"
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
                  {isSubmitting ? "Registering..." : "S'inscrire"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-slate-600">
                    Déjà un compte?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Se connecter
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

export default Register;
