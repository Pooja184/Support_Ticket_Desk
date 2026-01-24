import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import MobileHeader from "../../components/MobileHeader";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("AdminDashboard render", { user, loading });

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
