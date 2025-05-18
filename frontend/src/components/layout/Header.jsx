import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-bold text-primary">
            BackRoom
          </Link>

          <nav>
            <ul className="flex space-x-6">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="text-slate-700 hover:text-primary"
                    >
                      Profile
                    </Link>
                  </li>
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="text-slate-700 hover:text-primary"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-slate-700 hover:text-primary"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-slate-700 hover:text-primary"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-slate-700 hover:text-primary"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
