import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("");
    const success = await login(values);

    if (success) {
      navigate("/profile");
    }

    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Connexion</h1>
            <p className="text-slate-600">Sign in to your account</p>
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

                <div className="flex justify-between items-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
                >
                  {isSubmitting ? "Signing in..." : "Se connecter"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-slate-600">
                    Pas encore de compte?{" "}
                    <Link
                      to="/register"
                      className="text-primary hover:underline"
                    >
                      S'inscrire
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

export default Login;
