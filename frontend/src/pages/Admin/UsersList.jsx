import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Loading from "../../components/layout/Loading";

const UsersList = () => {
  const { getAllUsers } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [getAllUsers]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTermLower) ||
      user.nickname.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users List</h1>
        <Link to="/admin" className="text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-b border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Nickname
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Username
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Phone
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Role
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">{user.nickname}</td>
                  <td className="py-3 px-4 text-slate-700">{user.username}</td>
                  <td className="py-3 px-4 text-slate-700">{user.email}</td>
                  <td className="py-3 px-4 text-slate-700">{user.phone}</td>
                  <td className="py-3 px-4 text-slate-700 capitalize">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-4 px-4 text-center text-slate-500"
                >
                  {searchTerm
                    ? "No users found matching your search."
                    : "No users found in the system."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <div className="text-sm text-slate-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default UsersList;
