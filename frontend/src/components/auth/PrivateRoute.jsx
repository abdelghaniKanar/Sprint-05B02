import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Loading from "../layout/Loading";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
