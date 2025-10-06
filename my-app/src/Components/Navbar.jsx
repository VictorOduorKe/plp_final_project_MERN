import { useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // clears state + storage
    navigate("/", { replace: true }); // redirect cleanly
  };
  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="mazx-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-violet-600 hover:text-violet-700 transition-colors">
          AI Study<span className="text-gray-800">Planner</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          {!user?(<><Link to="/about" className="hover:text-violet-600 transition-colors">About</Link>
          <Link to="/services" className="hover:text-violet-600 transition-colors">Services</Link>
          <Link to="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
</>):( "")}
        
          {!user && (
            <Link to="/register" className="hover:text-violet-600 transition-colors">Register</Link>
          )}

          {!user ? (
            <Link to="/login" className="hover:text-violet-600 transition-colors">Login</Link>
          ) : (
            <>
              <span className="font-semibold text-violet-700">
                👤 {user.first_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-3xl text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col items-center py-4 space-y-4 text-gray-700 font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

            {!user && (
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            )}

            {!user ? (
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            ) : (
              <>
                <span className="font-semibold text-violet-700">
                  👤 {user.first_name || user.username}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
