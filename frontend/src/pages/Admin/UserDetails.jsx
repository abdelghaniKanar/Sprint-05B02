import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Loading from "../../components/layout/Loading";

const UserDetails = () => {
  const { getAllUsers, getUserHistory } = useContext(AuthContext);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get all users to find the specific one
        const users = await getAllUsers();
        const foundUser = users.find((u) => u._id === userId);

        if (!foundUser) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUser(foundUser);

        // Get user history
        const historyData = await getUserHistory(userId);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error loading user data");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId, getAllUsers, getUserHistory]);

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
              <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Link to="/admin/users" className="btn btn-primary inline-block">
                Back to Users List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Link to="/admin/users" className="text-primary hover:underline">
          Back to Users List
        </Link>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">User Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Nickname:</p>
            <p className="font-medium">{user.nickname}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Username:</p>
            <p className="font-medium">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone:</p>
            <p className="font-medium">{user.phone}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role:</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Verified:</p>
            <p className="font-medium">{user.isVerified ? "Yes" : "No"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Created:</p>
            <p className="font-medium">{formatDate(user.createdAt)}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last Updated:</p>
            <p className="font-medium">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">User Update History</h2>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    Field
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    Old Value
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    New Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 capitalize">
                      {item.field}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.oldValue}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.newValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500">
            No update history found for this user.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
