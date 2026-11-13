import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const MEDICINES_COLLECTION = 'medicines';

/**
 * Determine stock status based on quantity
 */
export function determineStockStatus(quantity, currentStatus) {
  const q = Number(quantity);
  if (isNaN(q) || q <= 0) return 'Out of Stock';
  if (q <= 10) return 'Low Stock';
  return currentStatus || 'Available';
}

/**
 * Add a new medicine
 */
export async function addMedicine(medicineData) {
  try {
    const qty = Number(medicineData.quantity) || 0;
    const price = Number(medicineData.price) || 0;
    const status = medicineData.status || determineStockStatus(qty);

    const docData = {
      pharmacyId: medicineData.pharmacyId,
      medicineName: medicineData.medicineName.trim(),
      genericName: (medicineData.genericName || '').trim(),
      strength: (medicineData.strength || '').trim(),
      category: (medicineData.category || 'General').trim(),
      quantity: qty,
      price: price,
      status: status,
      isPrescriptionRequired: Boolean(medicineData.isPrescriptionRequired),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, MEDICINES_COLLECTION), docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
}

/**
 * Update an existing medicine
 */
export async function updateMedicine(medicineId, updateData) {
  try {
    const docRef = doc(db, MEDICINES_COLLECTION, medicineId);
    const payload = { ...updateData };

    if (payload.quantity !== undefined) {
      payload.quantity = Number(payload.quantity);
      if (!payload.status) {
        payload.status = determineStockStatus(payload.quantity);
      }
    }
    if (payload.price !== undefined) {
      payload.price = Number(payload.price);
    }

    payload.updatedAt = serverTimestamp();

    await updateDoc(docRef, payload);
    return true;
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
}

/**
 * Delete a medicine
 */
export async function deleteMedicine(medicineId) {
  try {
    const docRef = doc(db, MEDICINES_COLLECTION, medicineId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
}

/**
 * Real-time subscription to medicines of a specific pharmacy
 */
export function subscribeToMedicinesByPharmacy(pharmacyId, callback) {
  if (!pharmacyId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, MEDICINES_COLLECTION),
    where('pharmacyId', '==', pharmacyId)
  );

  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    },
    (err) => {
      console.error('Real-time pharmacy medicines listener error:', err);
    }
  );
}

/**
 * Real-time subscription to ALL medicines (used for public search and admin catalog)
 */
export function subscribeToAllMedicines(callback) {
  const colRef = collection(db, MEDICINES_COLLECTION);
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    },
    (err) => {
      console.error('Real-time all medicines listener error:', err);
    }
  );
}

/**
 * Fetch all medicines by pharmacy ID once
 */
export async function getMedicinesByPharmacy(pharmacyId) {
  if (!pharmacyId) return [];
  try {
    const q = query(
      collection(db, MEDICINES_COLLECTION),
      where('pharmacyId', '==', pharmacyId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error getting medicines by pharmacy:', error);
    throw error;
  }
}
