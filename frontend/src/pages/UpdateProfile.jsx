import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../context/AuthContext";

const UpdateProfile = () => {
  const { user, updateProfile, requestSensitiveUpdate } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("regular");
  const [emailSent, setEmailSent] = useState(false);

  if (!user) {
    return null;
  }

  // Regular update form validation schema
  const regularValidationSchema = Yup.object({
    nickname: Yup.string()
      .min(3, "Nickname must be at least 3 characters")
      .max(30, "Nickname must be less than 30 characters"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters"),
  });

  // Sensitive update form validation schema
  const sensitiveValidationSchema = Yup.object({
    field: Yup.string()
      .required("Please select a field to update")
      .oneOf(["email", "phone"], "Invalid field selection"),
    value: Yup.string().when("field", {
      is: "email",
      then: (schema) =>
        schema.email("Invalid email address").required("Email is required"),
      otherwise: (schema) =>
        schema
          .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
          .required("Phone number is required"),
    }),
  });

  // Initial form values
  const regularInitialValues = {
    nickname: user.nickname || "",
    username: user.username || "",
  };

  const sensitiveInitialValues = {
    field: "email",
    value: "",
  };

  // Handle regular update form submission
  const handleRegularSubmit = async (values, { setSubmitting }) => {
    // Only include fields that were changed
    const updateData = {};
    if (values.nickname !== user.nickname)
      updateData.nickname = values.nickname;
    if (values.username !== user.username)
      updateData.username = values.username;

    // Only submit if there are changes
    if (Object.keys(updateData).length > 0) {
      const success = await updateProfile(updateData);
      if (success) {
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }

    setSubmitting(false);
  };

  // Handle sensitive update form submission
  const handleSensitiveSubmit = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const success = await requestSensitiveUpdate(values.field, values.value);

    if (success) {
      setEmailSent(true);
      resetForm();
    }

    setSubmitting(false);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Update Profile</h1>
            <Link to="/profile" className="text-primary hover:underline">
              Back to Profile
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "regular"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setActiveTab("regular")}
              >
                Basic Info
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "sensitive"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setActiveTab("sensitive")}
              >
                Email & Phone
              </button>
            </div>
          </div>

          {activeTab === "regular" ? (
            <Formik
              initialValues={regularInitialValues}
              validationSchema={regularValidationSchema}
              onSubmit={handleRegularSubmit}
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
                    />
                    <ErrorMessage
                      name="nickname"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Updating..." : "Confirm"}
                    </button>
                    <Link to="/profile" className="btn btn-outline">
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div>
              {emailSent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <svg
                      className="h-6 w-6 text-blue-500 mr-3"
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
                    <div>
                      <h3 className="text-md font-semibold text-blue-800">
                        Verification Email Sent!
                      </h3>
                      <p className="text-sm text-blue-700">
                        Please check your email to confirm this update. The
                        change will not take effect until confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <Formik
                initialValues={sensitiveInitialValues}
                validationSchema={sensitiveValidationSchema}
                onSubmit={handleSensitiveSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="field" className="form-label">
                        Field to Update
                      </label>
                      <Field
                        as="select"
                        id="field"
                        name="field"
                        className="form-input"
                        onChange={(e) => {
                          setFieldValue("field", e.target.value);
                          setFieldValue("value", ""); // Reset value when field changes
                        }}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </Field>
                      <ErrorMessage
                        name="field"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div>
                      <label htmlFor="value" className="form-label">
                        {values.field === "email"
                          ? "New Email"
                          : "New Phone Number"}
                      </label>
                      <Field
                        type={values.field === "email" ? "email" : "text"}
                        id="value"
                        name="value"
                        className="form-input"
                        placeholder={
                          values.field === "email"
                            ? "Enter new email"
                            : "Enter new phone number"
                        }
                      />
                      <ErrorMessage
                        name="value"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-slate-600 mb-4">
                        <strong>Note:</strong> Updating your {values.field}{" "}
                        requires email verification. A confirmation link will be
                        sent to your current email.
                      </p>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                      >
                        {isSubmitting ? "Requesting..." : "Request Update"}
                      </button>
                      <Link to="/profile" className="btn btn-outline">
                        Cancel
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
