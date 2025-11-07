import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

// ========== TEAM MEMBERS CRUD ==========

export const createTeamMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, "teamMembers"), {
      ...memberData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...memberData };
  } catch (error) {
    console.error("Error adding team member: ", error);
    throw error;
  }
};

export const getTeamMembers = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "teamMembers"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting team members: ", error);
    throw error;
  }
};

export const updateTeamMember = async (id, memberData) => {
  try {
    const memberRef = doc(db, "teamMembers", id);
    await updateDoc(memberRef, {
      ...memberData,
      updatedAt: new Date()
    });
    return { id, ...memberData };
  } catch (error) {
    console.error("Error updating team member: ", error);
    throw error;
  }
};

export const deleteTeamMember = async (id) => {
  try {
    await deleteDoc(doc(db, "teamMembers", id));
    return id;
  } catch (error) {
    console.error("Error deleting team member: ", error);
    throw error;
  }
};

// ========== PROJECTS CRUD ==========

export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "projects"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting projects: ", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const projectRef = doc(db, "projects", id);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: new Date()
    });
    return { id, ...projectData };
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, "projects", id));
    return id;
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};

// ========== SKILLS CRUD ==========

export const createSkill = async (skillData) => {
  try {
    const docRef = await addDoc(collection(db, "skills"), {
      ...skillData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...skillData };
  } catch (error) {
    console.error("Error adding skill: ", error);
    throw error;
  }
};

export const getSkills = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "skills"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting skills: ", error);
    throw error;
  }
};

export const updateSkill = async (id, skillData) => {
  try {
    const skillRef = doc(db, "skills", id);
    await updateDoc(skillRef, {
      ...skillData,
      updatedAt: new Date()
    });
    return { id, ...skillData };
  } catch (error) {
    console.error("Error updating skill: ", error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    await deleteDoc(doc(db, "skills", id));
    return id;
  } catch (error) {
    console.error("Error deleting skill: ", error);
    throw error;
  }
};

// ========== USER-SPECIFIC DATA ==========

export const getUserData = async (userId) => {
  try {
    const teamQuery = query(
      collection(db, "teamMembers"),
      where("userId", "==", userId)
    );
    const teamSnapshot = await getDocs(teamQuery);

    const skillsQuery = query(
      collection(db, "skills"),
      where("userId", "==", userId)
    );
    const skillsSnapshot = await getDocs(skillsQuery);

    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", userId)
    );
    const projectsSnapshot = await getDocs(projectsQuery);

    return {
      teamMember: teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] || null,
      skills: skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      projects: projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error("Error getting user data: ", error);
    throw error;
  }
};

// ========== CLEAR COLLECTIONS (FOR REINITIALIZATION) ==========

export const clearAllCollections = async () => {
  try {
    console.log("Clearing all collections...");

    // Clear team members
    const teamSnapshot = await getDocs(collection(db, "teamMembers"));
    const teamDeletes = teamSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(teamDeletes);
    console.log(`Deleted ${teamSnapshot.docs.length} team members`);

    // Clear projects
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    const projectDeletes = projectsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(projectDeletes);
    console.log(`Deleted ${projectsSnapshot.docs.length} projects`);

    // Clear skills
    const skillsSnapshot = await getDocs(collection(db, "skills"));
    const skillDeletes = skillsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(skillDeletes);
    console.log(`Deleted ${skillsSnapshot.docs.length} skills`);

    console.log("All collections cleared successfully");
  } catch (error) {
    console.error("Error clearing collections: ", error);
    throw error;
  }
};
