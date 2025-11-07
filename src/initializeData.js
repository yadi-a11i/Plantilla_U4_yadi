import {
  createTeamMember,
  createProject,
  createSkill,
  clearAllCollections
} from './services/firestore';

// Datos iniciales para poblar Firebase
export const initializeFirebaseData = async () => {
  try {
    console.log("🚀 Reinicializando datos en Firebase...");

    // Limpiar todas las colecciones existentes
    console.log("🧹 Limpiando datos existentes...");
    await clearAllCollections();

    console.log("✨ Creando datos frescos...");

    // ========== MIEMBROS DEL EQUIPO ==========
    const teamMembers = [
      {
        name: "Ana García López",
        role: "Fundadora & Coordinadora General",
        bio: "Ingeniera en Sistemas con 8 años de experiencia en desarrollo web y liderazgo de proyectos tecnológicos. Apasionada por el empoderamiento femenino y la creación de espacios inclusivos en tecnología.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        skills: ["JavaScript", "React", "Node.js", "Liderazgo", "Gestión de Proyectos", "Mentoría"],
        experience: "8 años en desarrollo web y gestión de equipos",
        education: "Ingeniería en Sistemas - Universidad Nacional",
        currentFocus: "Desarrollando una plataforma de mentoría tecnológica para conectar a más mujeres con oportunidades en tech",
        funFact: "Aprendió a programar a los 12 años creando mods para videojuegos, y ahora su hija de 8 años ya está siguiendo sus pasos",
        social: {
          linkedin: "https://linkedin.com/in/ana-garcia",
          github: "https://github.com/ana-garcia",
          email: "ana@codigorosa.org"
        },
        userId: "Cp0ZePtEY3gh6uDUfrGmyK9nHHY2",
        userEmail: "admin@u4.com"
      }
    ];

    // ========== PROYECTOS ==========
    const projects = [
      {
        title: "EduTech Platform",
        description: "Plataforma educativa online que conecta a mentoras tecnológicas con estudiantes, proporcionando cursos interactivos, seguimiento personalizado y una comunidad de apoyo.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        category: "Educación",
        status: "completado",
        startDate: "2024-01-15",
        endDate: "2024-06-30",
        technologies: ["React", "Node.js", "PostgreSQL", "Firebase", "WebRTC"],
        objectives: [
          "Democratizar el acceso a educación tecnológica de calidad",
          "Crear una red de mentoras expertas",
          "Implementar seguimiento personalizado del progreso",
          "Fomentar la comunidad y colaboración entre estudiantes"
        ],
        targetAudience: "Mujeres jóvenes interesadas en tecnología, edades 16-28",
        budget: "$45,000 USD",
        team: ["Ana García", "María Rodríguez", "Sofía Chen"],
        links: {
          website: "https://edutech.com",
          github: "https://github.com/codigo-rosa/edutech-platform",
          documentation: "https://docs.edutech.com"
        },
        userId: "Cp0ZePtEY3gh6uDUfrGmyK9nHHY2",
        userEmail: "admin@u4.com"
      }
    ];

    // ========== HABILIDADES ==========
    const skills = [
      {
        name: "React.js",
        category: "Programación",
        description: "Biblioteca de JavaScript para construir interfaces de usuario interactivas y dinámicas. Fundamental para el desarrollo frontend moderno.",
        level: "intermedio",
        resources: [
          "Documentación oficial de React",
          "React Tutorial - Codecademy",
          "The Complete React Developer Course - Udemy"
        ],
        prerequisites: ["JavaScript ES6+", "HTML", "CSS"],
        learningTime: "2-4 meses",
        demandLevel: "muy-alto",
        relatedCareers: ["Frontend Developer", "Full Stack Developer", "UI Developer"],
        userId: "Cp0ZePtEY3gh6uDUfrGmyK9nHHY2",
        userEmail: "admin@u4.com"
      }
    ];

    // Crear miembros del equipo
    console.log("👥 Creando miembros del equipo...");
    for (const member of teamMembers) {
      await createTeamMember(member);
      console.log(`✅ Creado: ${member.name}`);
    }

    // Crear proyectos
    console.log("📋 Creando proyectos...");
    for (const project of projects) {
      await createProject(project);
      console.log(`✅ Creado: ${project.title}`);
    }

    // Crear habilidades
    console.log("⭐ Creando habilidades...");
    for (const skill of skills) {
      await createSkill(skill);
      console.log(`✅ Creado: ${skill.name}`);
    }

    console.log("🎉 ¡Datos iniciales creados exitosamente en Firebase!");

  } catch (error) {
    console.error("❌ Error inicializando datos:", error);
    throw error;
  }
};
