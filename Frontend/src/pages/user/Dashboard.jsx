import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import Sidebar from "../../components/Sidebar";
import MobileHeader from "../../components/MobileHeader";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
