import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const USERS_COLLECTION = 'users';

/**
 * Create or save user profile in Firestore
 */
export async function createUserProfile(uid, data) {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const existingSnap = await getDoc(userRef);

    if (!existingSnap.exists()) {
      const newProfile = {
        name: data.name || 'User',
        email: data.email || '',
        role: data.role || 'user', // 'user' | 'pharmacy_owner' | 'admin'
        disabled: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      return { uid, ...newProfile };
    }

    return { uid, ...existingSnap.data() };
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    throw error;
  }
}

/**
 * Fetch user profile from Firestore by UID
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { uid, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Fetch all users (Admin view)
 */
export async function getAllUsers() {
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

/**
 * Subscribe to all users in real-time (Admin Dashboard)
 */
export function subscribeToAllUsers(callback) {
  const colRef = collection(db, USERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      callback(list);
    },
    (err) => {
      console.error('Real-time users listener error:', err);
    }
  );
}

/**
 * Update user role (e.g. promote to admin or change to pharmacy_owner)
 */
export async function updateUserRole(uid, newRole) {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Toggle user account status (active / disabled)
 */
export async function toggleUserDisabled(uid, disabled) {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      disabled: Boolean(disabled),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}
