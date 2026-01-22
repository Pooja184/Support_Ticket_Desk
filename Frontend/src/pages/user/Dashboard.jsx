import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  const { user, loading } = useAuth();

  console.log("Dashboard render", { user, loading });

  if (loading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/user-login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
