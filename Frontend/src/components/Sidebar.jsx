import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth(); // get current user
 console.log("Sidebar user", user);


  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-8 p-3 border rounded">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
          <FiUser size={18} />
        </div>

        <div>
          <p className="text-sm text-gray-600">Hello</p>
          <p className="font-semibold text-black">
            {user?.name || "User"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <NavItem to="add-tickets" label="Add Tickets" />

      <NavItem to="/dashboard/my-tickets" label="My Tickets" />
      <NavItem to="/dashboard/all-tickets" label="All Tickets" />


      {/* Logout */}
      <div className="mt-auto">
        <button className="w-full border p-2 rounded bg-black text-white">
          Logout
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block p-2 rounded mb-2 ${
        isActive ? "bg-black text-white" : "hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default Sidebar;
