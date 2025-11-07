import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserData,
  createTeamMember,
  updateTeamMember,
} from "../services/firestore";

const UserProfile = () => {
  const { user, userRole, isTeam } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    skills: [],
    experience: "",
    education: "",
    social: {
      linkedin: "",
      github: "",
      email: "",
    },
  });

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getUserData(user.uid);
      setUserData(data);

      if (data.teamMember) {
        setFormData(data.teamMember);
      } else {
        // Prellenar con datos básicos del usuario
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || "",
          social: {
            ...prev.social,
            email: user.email || "",
          },
        }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [user, loadUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const profileData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
      };

      if (userData?.teamMember?.id) {
        await updateTeamMember(userData.teamMember.id, profileData);
      } else {
        await createTeamMember(profileData);
      }

      await loadUserData();
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-gray-600">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h2>
        <p className="text-gray-600">
          Gestiona tu información personal y profesional
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-6 border">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-2xl font-bold">
              {(user?.displayName || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.displayName || "Usuario"}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-purple-600 font-medium">
              {userRole === "admin"
                ? "Administradora"
                : userRole === "team"
                ? "Miembro del Equipo"
                : "Usuario"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      {isTeam && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol en la Organización
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: Coordinadora de Proyectos"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Cuéntanos sobre ti, tu experiencia y pasión por el empoderamiento femenino..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades (separadas por comas)
              </label>
              <input
                type="text"
                value={formData.skills.join(", ")}
                onChange={handleSkillsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: Liderazgo, Programación, Diseño"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: 5 años en tecnología"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Educación
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="ej: Ingeniería en Sistemas - UNAM"
            />
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Redes Sociales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={formData.social.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  name="social.github"
                  value={formData.social.github}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://github.com/tu-usuario"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-md font-medium hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Perfil"
              )}
            </button>
          </div>
        </form>
      )}

      {!isTeam && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Limitado
          </h3>
          <p className="text-gray-600">
            Solo los miembros del equipo pueden editar información del perfil.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
