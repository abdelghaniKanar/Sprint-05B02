import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Loading from "../layout/Loading";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated && user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
