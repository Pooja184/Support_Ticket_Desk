import { NavLink, useNavigate } from "react-router-dom";
import {
  FiEdit3,
  FiFileText,
  FiHeadphones,
  FiLogOut,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-white text-slate-950
          shadow-2xl ring-1 ring-slate-200 transform transition-transform duration-300 md:sticky md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
              <FiHeadphones size={20} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Support Desk
              </p>
              <h2 className="text-lg font-semibold">User Panel</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 md:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200">
                <FiUser size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Welcome back
                </p>
                <p className="truncate font-semibold text-slate-950">
                  {user?.name || "User"}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-2" aria-label="User navigation">
            <NavItem
              to="add-tickets"
              label="Create Ticket"
              icon={<FiEdit3 size={18} />}
              onClick={onClose}
            />
            <NavItem
              to="my-tickets"
              label="My Tickets"
              icon={<FiFileText size={18} />}
              onClick={onClose}
            />
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-200 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white"
          >
            <FiLogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
        isActive
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;
