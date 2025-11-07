import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../services/auth";
import { initializeFirebaseData } from "../initializeData";
import TeamMemberManager from "./TeamMemberManager";
import ProjectsManager from "./ProjectsManager";
import SkillsManager from "./SkillsManager";
import UserProfile from "./UserProfile";

const Dashboard = () => {
  const { user, userRole, isAdmin, isTeam } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [initializingData, setInitializingData] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setLoading(false);
  };

  const handleInitializeData = async () => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "¿Estás segura de que quieres REINICIALIZAR Firebase? Esto ELIMINARÁ todos los datos existentes y los reemplazará con datos de ejemplo frescos (miembros del equipo, proyectos y habilidades)."
    );

    if (!confirmed) return;

    setInitializingData(true);
    try {
      await initializeFirebaseData();
      alert(
        "¡Datos reinicializados exitosamente en Firebase! Recarga la página para ver los datos frescos."
      );
    } catch (error) {
      console.error("Error inicializando datos:", error);
      alert("Error al crear los datos iniciales. Revisa la consola.");
    }
    setInitializingData(false);
  };

  const tabs = [
    { id: "profile", name: "Mi Perfil", icon: "👤", access: "all" },
    { id: "team", name: "Equipo", icon: "👥", access: "team" },
    { id: "projects", name: "Proyectos", icon: "📋", access: "team" },
    { id: "skills", name: "Habilidades", icon: "⭐", access: "team" },
  ];

  const hasAccess = (tabAccess) => {
    if (tabAccess === "all") return true;
    if (tabAccess === "team") return isTeam;
    if (tabAccess === "admin") return isAdmin;
    return false;
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administradora";
      case "team":
        return "Miembro del Equipo";
      default:
        return "Usuario";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfile />;
      case "team":
        return <TeamMemberManager />;
      case "projects":
        return <ProjectsManager />;
      case "skills":
        return <SkillsManager />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">CR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard 
                </h1>
                <p className="text-sm text-gray-500">
                  Sistema de Gestión Administrativa
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleLabel(userRole)}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={handleInitializeData}
                  disabled={initializingData}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {initializingData
                    ? "Reinicializando..."
                    : "Reiniciar Firebase"}
                </button>
              )}

              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Saliendo..." : "Cerrar Sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Navegación
              </h2>
              <ul className="space-y-2">
                {tabs.map(
                  (tab) =>
                    hasAccess(tab.access) && (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? "bg-pink-100 text-pink-700 border-r-4 border-pink-500"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="mr-3 text-lg">{tab.icon}</span>
                          {tab.name}
                        </button>
                      </li>
                    )
                )}
              </ul>

              {/* Role Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Tu Rol
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {getRoleLabel(userRole)}
                </p>
                <div className="text-xs text-gray-500">
                  {isAdmin && (
                    <div className="mb-1">✅ Gestión completa del sistema</div>
                  )}
                  {isTeam && (
                    <div className="mb-1">✅ Editar contenido del sitio</div>
                  )}
                  <div>✅ Gestionar perfil personal</div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
