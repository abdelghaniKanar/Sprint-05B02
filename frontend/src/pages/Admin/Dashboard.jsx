import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Loading from "../../components/layout/Loading";

const AdminDashboard = () => {
  const { user, getUserCount } = useContext(AuthContext);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getUserCount();
        setUserCount(count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [getUserCount]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/users" className="btn btn-primary">
          View All Users
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Total Users
            </h2>
            <p className="text-3xl font-bold text-blue-600">{userCount}</p>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Your Role
            </h2>
            <p className="text-3xl font-bold text-green-600 capitalize">
              {user?.role || "Unknown"}
            </p>
          </div>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              Admin Actions
            </h2>
            <div className="flex flex-col space-y-2 mt-4">
              <Link
                to="/admin/users"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Manage Users
              </Link>
              <Link
                to="/profile"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                View Your Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Admin Overview</h2>
        <p className="text-slate-700 mb-4">
          Welcome to the admin dashboard. As an administrator, you have access
          to view and manage user accounts. You can see the list of all users
          and track their profile updates through the user management interface.
        </p>
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2">Available Admin Actions:</h3>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>View all registered users</li>
            <li>Track user information updates</li>
            <li>Monitor user account activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
