import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="text-center">
              <p className="text-lg text-slate-700 mb-4">
                Loading profile information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <div className="flex space-x-3">
              <Link to="/update-profile" className="btn btn-primary">
                Update
              </Link>
              <button onClick={logout} className="btn btn-danger">
                Log Out
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Nickname:</p>
                  <p className="font-medium">{user.nickname}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Username:</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Email:</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone:</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">Account Role:</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Password:</p>
                  <p className="font-medium">• • • • • • • •</p>
                </div>
                <div className="flex items-end">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline text-sm"
                  >
                    Reset Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
