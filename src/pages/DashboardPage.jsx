import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";
import Dashboard from "../components/Dashboard";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">{user ? <Dashboard /> : <AuthForm />}</div>
  );
};

export default DashboardPage;
