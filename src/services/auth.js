import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

// Provider para Google
const googleProvider = new GoogleAuthProvider();

// ========== AUTENTICACIÓN ==========

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar el perfil con el nombre
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("Error de login:", error.code, error.message);

    // Si el usuario no existe y es una cuenta de demo, crearla automáticamente
    if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') && isDemoAccount(email, password)) {
      console.log("Creando cuenta de demo automáticamente...");
      try {
        return await createDemoAccount(email, password);
      } catch (createError) {
        if (createError.code === 'auth/email-already-in-use') {
          // Si la cuenta ya existe, intentar login nuevamente
          console.log("La cuenta ya existe, reintentando login...");
          return await signInWithEmailAndPassword(auth, email, password);
        }
        throw createError;
      }
    }

    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ========== ROLES SIMULADOS ==========
// Para esta versión, simularemos roles basados en el email

export const getUserRole = (user) => {
  if (!user?.email) return 'visitor';

  const email = user.email.toLowerCase();

  // Roles predefinidos para demostración
  const adminEmails = [
    'admin@u4.com',
  ];

  const teamEmails = [
    'team@u4.com',
  ];

  if (adminEmails.includes(email)) {
    return 'admin';
  } else if (teamEmails.includes(email)) {
    return 'team';
  } else {
    return 'user';
  }
};

export const canEditTeamMember = (user) => {
  const role = getUserRole(user);

  // Admin puede editar todo
  if (role === 'admin') return true;

  // Team members pueden editar solo su propia información
  if (role === 'team') {
    // Para demo, permitimos edición si está logueado como team
    return true;
  }

  return false;
};

export const canManageProjects = (user) => {
  const role = getUserRole(user);
  return role === 'admin' || role === 'team';
};

export const canManageSkills = (user) => {
  const role = getUserRole(user);
  return role === 'admin' || role === 'team';
};

// ========== CUENTAS DE DEMO ==========

const demoAccounts = [
  { email: 'admin@u4.com', password: 'admin123', name: 'Administradora Demo' },
  { email: 'team@u4.com', password: 'team123', name: 'Equipo Demo' },
  { email: 'user@gmail.com', password: 'user123', name: 'Usuario Demo' }
];

export const isDemoAccount = (email, password) => {
  return demoAccounts.some(account =>
    account.email === email && account.password === password
  );
};

export const createDemoAccount = async (email, password) => {
  try {
    const demoAccount = demoAccounts.find(account => account.email === email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (demoAccount?.name) {
      await updateProfile(userCredential.user, {
        displayName: demoAccount.name
      });
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error creating demo account: ", error);
    throw error;
  }
};
