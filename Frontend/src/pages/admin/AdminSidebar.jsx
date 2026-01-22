import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/admin-login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 min-h-screen w-64 bg-white border-r p-4
          flex flex-col z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={onClose} className="md:hidden">
            <FiX size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-8 p-3 border rounded">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
            <FiUser size={18} />
          </div>

          <div>
            <p className="text-sm text-gray-600">Hello</p>
            <p className="font-semibold text-black">
              {user?.name || "Admin"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <NavItem to="all-tickets" label="All Tickets" onClick={onClose} />

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full border p-2 rounded bg-red-600 text-white hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block p-2 rounded mb-2 ${
        isActive ? "bg-black text-white" : "hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default AdminSidebar;
