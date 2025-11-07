import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/firestore";

const SkillsManager = () => {
  const { isAdmin, user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    level: "intermedio",
    resources: [],
    prerequisites: [],
    learningTime: "",
    demandLevel: "medio",
    relatedCareers: [],
  });

  const categoryOptions = [
    "Programación",
    "Diseño Web",
    "Diseño UX/UI",
    "Bases de Datos",
    "DevOps",
    "Inteligencia Artificial",
    "Ciberseguridad",
    "Marketing Digital",
    "Análisis de Datos",
    "Gestión de Proyectos",
    "Soft Skills",
    "Otro",
  ];

  const levelOptions = [
    { value: "basico", label: "Básico", color: "bg-green-100 text-green-800" },
    {
      value: "intermedio",
      label: "Intermedio",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "avanzado", label: "Avanzado", color: "bg-red-100 text-red-800" },
    {
      value: "experto",
      label: "Experto",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const demandOptions = [
    {
      value: "bajo",
      label: "Demanda Baja",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "medio",
      label: "Demanda Media",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "alto",
      label: "Demanda Alta",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "muy-alto",
      label: "Demanda Muy Alta",
      color: "bg-pink-100 text-pink-800",
    },
  ];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skillsData = await getSkills();
      setSkills(skillsData);
    } catch (error) {
      console.error("Error loading skills:", error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      level: "intermedio",
      resources: [],
      prerequisites: [],
      learningTime: "",
      demandLevel: "medio",
      relatedCareers: [],
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const skillData = {
        ...formData,
        userId: editingSkill?.userId || user.uid,
        userEmail: editingSkill?.userEmail || user.email,
      };

      if (editingSkill) {
        await updateSkill(editingSkill.id, skillData);
      } else {
        await createSkill(skillData);
      }

      await loadSkills();
      resetForm();
      alert(
        editingSkill
          ? "Habilidad actualizada exitosamente"
          : "Habilidad agregada exitosamente"
      );
    } catch (error) {
      console.error("Error saving skill:", error);
      alert("Error al guardar la habilidad");
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "",
      description: skill.description || "",
      level: skill.level || "intermedio",
      resources: skill.resources || [],
      prerequisites: skill.prerequisites || [],
      learningTime: skill.learningTime || "",
      demandLevel: skill.demandLevel || "medio",
      relatedCareers: skill.relatedCareers || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás segura de que quieres eliminar esta habilidad?")
    ) {
      return;
    }

    try {
      await deleteSkill(id);
      await loadSkills();
      alert("Habilidad eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Error al eliminar la habilidad");
    }
  };

  const getLevelColor = (level) => {
    return (
      levelOptions.find((option) => option.value === level)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getLevelLabel = (level) => {
    return (
      levelOptions.find((option) => option.value === level)?.label || level
    );
  };

  const getDemandColor = (demand) => {
    return (
      demandOptions.find((option) => option.value === demand)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getDemandLabel = (demand) => {
    return (
      demandOptions.find((option) => option.value === demand)?.label || demand
    );
  };

  // Agrupar skills por categoría
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Sin categoría";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🚫</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Acceso Denegado
        </h3>
        <p className="text-gray-600">
          Solo las administradoras pueden gestionar las habilidades.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-gray-600">Cargando habilidades...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestión de Habilidades
          </h2>
          <p className="text-gray-600">
            Administra el catálogo de habilidades tecnológicas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md font-medium hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Nueva Habilidad
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSkill ? "Editar Habilidad" : "Nueva Habilidad"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Habilidad *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="ej: React.js, Python, UX Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Describe qué es esta habilidad y por qué es importante..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Dificultad *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demanda Laboral *
                </label>
                <select
                  name="demandLevel"
                  value={formData.demandLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {demandOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Aprendizaje
                </label>
                <input
                  type="text"
                  name="learningTime"
                  value={formData.learningTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="ej: 3-6 meses, 2 semanas"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prerrequisitos (separados por comas)
              </label>
              <input
                type="text"
                value={formData.prerequisites.join(", ")}
                onChange={(e) =>
                  handleArrayChange("prerequisites", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: HTML básico, Conceptos de programación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recursos de Aprendizaje (separados por comas)
              </label>
              <textarea
                value={formData.resources.join(", ")}
                onChange={(e) => handleArrayChange("resources", e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: Codecademy, MDN Web Docs, YouTube - Curso de React"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carreras Relacionadas (separadas por comas)
              </label>
              <input
                type="text"
                value={formData.relatedCareers.join(", ")}
                onChange={(e) =>
                  handleArrayChange("relatedCareers", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ej: Desarrollador Frontend, Ingeniero de Software"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-md font-medium hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {editingSkill ? "Actualizar" : "Crear"} Habilidad
              </button>
            </div>
          </form>
        </div>
      )}

      {Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(
            ([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-md font-semibold text-gray-900 line-clamp-2">
                          {skill.name}
                        </h4>
                        <div className="flex space-x-1 ml-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
                              skill.level
                            )}`}
                          >
                            {getLevelLabel(skill.level)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {skill.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDemandColor(
                            skill.demandLevel
                          )}`}
                        >
                          {getDemandLabel(skill.demandLevel)}
                        </span>

                        {skill.learningTime && (
                          <p className="text-xs text-gray-500">
                            ⏱️ Tiempo: {skill.learningTime}
                          </p>
                        )}
                      </div>

                      {skill.prerequisites &&
                        skill.prerequisites.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              PRERREQUISITOS
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {skill.prerequisites
                                .slice(0, 2)
                                .map((prereq, index) => (
                                  <span
                                    key={index}
                                    className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5 rounded"
                                  >
                                    {prereq}
                                  </span>
                                ))}
                              {skill.prerequisites.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{skill.prerequisites.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="text-xs text-gray-500">
                          {skill.relatedCareers &&
                            skill.relatedCareers.length > 0 && (
                              <span>
                                💼 {skill.relatedCareers.length} carreras
                              </span>
                            )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay habilidades registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando tu primera habilidad en el catálogo.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md font-medium hover:from-pink-600 hover:to-purple-600"
          >
            Crear Primera Habilidad
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
