import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

const PHARMACIES_COLLECTION = 'pharmacies';

/**
 * Fetch a single pharmacy by document ID
 */
export async function getPharmacyById(pharmacyId) {
  if (!pharmacyId) return null;
  try {
    const docRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching pharmacy by ID:', error);
    throw error;
  }
}

/**
 * Fetch pharmacy belonging to a specific owner UID
 */
export async function getPharmacyByOwnerId(ownerId) {
  if (!ownerId) return null;
  try {
    const q = query(
      collection(db, PHARMACIES_COLLECTION),
      where('ownerId', '==', ownerId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching pharmacy by ownerId:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for a specific owner's pharmacy
 */
export function subscribeToOwnerPharmacy(ownerId, callback) {
  if (!ownerId) {
    callback(null);
    return () => {};
  }
  const q = query(
    collection(db, PHARMACIES_COLLECTION),
    where('ownerId', '==', ownerId)
  );

  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    },
    (err) => {
      console.error('Real-time owner pharmacy listener error:', err);
    }
  );
}

/**
 * Fetch all verified pharmacies (verified === true)
 */
export async function getVerifiedPharmacies() {
  try {
    const q = query(
      collection(db, PHARMACIES_COLLECTION),
      where('verified', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('Error fetching verified pharmacies:', error);
    throw error;
  }
}

/**
 * Subscribe to all verified pharmacies with real-time updates
 */
export function subscribeToVerifiedPharmacies(callback) {
  const q = query(
    collection(db, PHARMACIES_COLLECTION),
    where('verified', '==', true)
  );

  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(list);
    },
    (err) => {
      console.error('Real-time verified pharmacies listener error:', err);
    }
  );
}

/**
 * Fetch all pharmacies (Admin only)
 */
export async function getAllPharmacies() {
  try {
    const snap = await getDocs(collection(db, PHARMACIES_COLLECTION));
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('Error fetching all pharmacies:', error);
    throw error;
  }
}

/**
 * Subscribe to all pharmacies (Admin Dashboard)
 */
export function subscribeToAllPharmacies(callback) {
  const colRef = collection(db, PHARMACIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(list);
    },
    (err) => {
      console.error('Real-time all pharmacies listener error:', err);
    }
  );
}

/**
 * Register or create a new pharmacy
 * Default verified: false, status: 'Pending'
 */
export async function createPharmacy(pharmacyData) {
  try {
    const newDoc = {
      name: pharmacyData.name.trim(),
      ownerId: pharmacyData.ownerId,
      phone: pharmacyData.phone.trim(),
      email: pharmacyData.email.trim(),
      address: pharmacyData.address.trim(),
      city: pharmacyData.city.trim(),
      pincode: pharmacyData.pincode.trim(),
      latitude: Number(pharmacyData.latitude) || 0,
      longitude: Number(pharmacyData.longitude) || 0,
      openingTime: pharmacyData.openingTime || '08:00 AM',
      closingTime: pharmacyData.closingTime || '10:00 PM',
      verified: false,
      status: 'Pending', // 'Pending' | 'Verified' | 'Rejected'
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, PHARMACIES_COLLECTION), newDoc);
    return { id: docRef.id, ...newDoc };
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    throw error;
  }
}

/**
 * Update pharmacy details
 */
export async function updatePharmacy(pharmacyId, data) {
  try {
    const docRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const updatePayload = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    // Ensure numeric coordinates
    if (updatePayload.latitude !== undefined) updatePayload.latitude = Number(updatePayload.latitude);
    if (updatePayload.longitude !== undefined) updatePayload.longitude = Number(updatePayload.longitude);

    await updateDoc(docRef, updatePayload);
    return true;
  } catch (error) {
    console.error('Error updating pharmacy:', error);
    throw error;
  }
}

/**
 * Admin action: Approve or Reject a pharmacy
 */
export async function updatePharmacyVerification(pharmacyId, verified, status = null) {
  try {
    const docRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const resolvedStatus = status || (verified ? 'Verified' : 'Rejected');
    await updateDoc(docRef, {
      verified: Boolean(verified),
      status: resolvedStatus,
      reviewedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating pharmacy verification:', error);
    throw error;
  }
}

/**
 * Delete a pharmacy
 */
export async function deletePharmacy(pharmacyId) {
  try {
    const docRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting pharmacy:', error);
    throw error;
  }
}
