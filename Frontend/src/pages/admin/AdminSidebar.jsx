import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiLogOut,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-950 text-white
          flex flex-col z-50 transform transition-transform duration-300 shadow-2xl md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
              <FiShield size={20} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-200">
                Support Desk
              </p>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950">
                <FiUser size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="truncate font-semibold">
                  {user?.name || "Admin"}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-2" aria-label="Admin navigation">
            <NavItem
              to="all-tickets"
              label="All Tickets"
              icon={<FiGrid size={18} />}
              onClick={onClose}
            />
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-300/20 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500 hover:text-white"
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
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default AdminSidebar;
