import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ConfirmUpdate from "./pages/ConfirmUpdate";

// Protected pages
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";

// Admin pages
import AdminDashboard from "./pages/Admin/Dashboard";
import UsersList from "./pages/Admin/UsersList";
import UserDetails from "./pages/Admin/UserDetails";

// Layout components
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/confirm-update" element={<ConfirmUpdate />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersList />} />
                <Route path="/admin/users/:userId" element={<UserDetails />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
