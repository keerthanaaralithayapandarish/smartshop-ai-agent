import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Sample pharmacies in Mangalore with realistic coordinates and details
export const SAMPLE_PHARMACIES = [
  {
    id: 'sample_pharmacy_abc',
    name: 'ABC Pharmacy',
    ownerId: 'sample_owner_abc',
    ownerName: 'Dr. Rajesh Rao',
    phone: '+91 824 244 5678',
    email: 'abc.pharmacy@example.com',
    address: 'Near City Centre Mall, K.S. Rao Road, Hampankatta',
    city: 'Mangalore',
    pincode: '575001',
    latitude: 12.8687,
    longitude: 74.8427,
    openingTime: '08:00 AM',
    closingTime: '10:30 PM',
    verified: true,
    status: 'Verified',
    isSampleData: true,
  },
  {
    id: 'sample_pharmacy_mangalore_medicals',
    name: 'Mangalore Medicals',
    ownerId: 'sample_owner_mm',
    ownerName: 'Suresh Shenoy',
    phone: '+91 824 222 1122',
    email: 'contact@mangaloremedicals.in',
    address: 'Opp. KMC Hospital, Dr. B.R. Ambedkar Circle, Balmatta',
    city: 'Mangalore',
    pincode: '575002',
    latitude: 12.8715,
    longitude: 74.8480,
    openingTime: '24 Hours (Open)',
    closingTime: '24 Hours (Open)',
    verified: true,
    status: 'Verified',
    isSampleData: true,
  },
  {
    id: 'sample_pharmacy_city_care',
    name: 'City Care Pharmacy',
    ownerId: 'sample_owner_cc',
    ownerName: 'Anitha D\'Souza',
    phone: '+91 824 249 9880',
    email: 'care@citycarepharmacy.com',
    address: 'Kadri Hills, Next to Mallikatta Circle, Kadri',
    city: 'Mangalore',
    pincode: '575003',
    latitude: 12.8835,
    longitude: 74.8622,
    openingTime: '08:30 AM',
    closingTime: '11:00 PM',
    verified: true,
    status: 'Verified',
    isSampleData: true,
  },
  {
    id: 'sample_pharmacy_metro_pending',
    name: 'Metro Health Pharmacy (New Application)',
    ownerId: 'sample_owner_metro',
    ownerName: 'Praveen Kumar',
    phone: '+91 824 241 3344',
    email: 'metrohealth.mng@gmail.com',
    address: 'Highway Junction, Kuntikan',
    city: 'Mangalore',
    pincode: '575006',
    latitude: 12.9020,
    longitude: 74.8490,
    openingTime: '09:00 AM',
    closingTime: '09:30 PM',
    verified: false,
    status: 'Pending',
    isSampleData: true,
  },
];

// Sample medicines mapped across the pharmacies
export const SAMPLE_MEDICINES = [
  // ABC Pharmacy inventory
  {
    id: 'sample_med_dolo_abc',
    pharmacyId: 'sample_pharmacy_abc',
    medicineName: 'Paracetamol 650mg',
    genericName: 'Paracetamol / Acetaminophen (Dolo 650)',
    strength: '650mg',
    category: 'Analgesics & Antipyretic',
    quantity: 120,
    price: 32,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
  {
    id: 'sample_med_azee_abc',
    pharmacyId: 'sample_pharmacy_abc',
    medicineName: 'Azithromycin 500mg',
    genericName: 'Azithromycin Dihydrate (Azee 500)',
    strength: '500mg',
    category: 'Antibiotics',
    quantity: 18,
    price: 115,
    status: 'Available',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_cetzine_abc',
    pharmacyId: 'sample_pharmacy_abc',
    medicineName: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride (Cetzine 10)',
    strength: '10mg',
    category: 'Antihistamines',
    quantity: 4,
    price: 24,
    status: 'Low Stock',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
  {
    id: 'sample_med_amox_abc',
    pharmacyId: 'sample_pharmacy_abc',
    medicineName: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate (Novamox 500)',
    strength: '500mg',
    category: 'Antibiotics',
    quantity: 0,
    price: 88,
    status: 'Out of Stock',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_pan_abc',
    pharmacyId: 'sample_pharmacy_abc',
    medicineName: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole Sodium (Pan 40)',
    strength: '40mg',
    category: 'Antacids & Gastro',
    quantity: 65,
    price: 135,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },

  // Mangalore Medicals inventory
  {
    id: 'sample_med_dolo_mm',
    pharmacyId: 'sample_pharmacy_mangalore_medicals',
    medicineName: 'Paracetamol 650mg',
    genericName: 'Paracetamol (Calpol 650)',
    strength: '650mg',
    category: 'Analgesics & Antipyretic',
    quantity: 85,
    price: 28,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
  {
    id: 'sample_med_azee_mm',
    pharmacyId: 'sample_pharmacy_mangalore_medicals',
    medicineName: 'Azithromycin 500mg',
    genericName: 'Azithromycin (Azithral 500)',
    strength: '500mg',
    category: 'Antibiotics',
    quantity: 3,
    price: 110,
    status: 'Low Stock',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_amox_mm',
    pharmacyId: 'sample_pharmacy_mangalore_medicals',
    medicineName: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin (Mox 500)',
    strength: '500mg',
    category: 'Antibiotics',
    quantity: 45,
    price: 82,
    status: 'Available',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_telma_mm',
    pharmacyId: 'sample_pharmacy_mangalore_medicals',
    medicineName: 'Telmisartan 40mg',
    genericName: 'Telmisartan (Telma 40)',
    strength: '40mg',
    category: 'Cardiovascular & BP',
    quantity: 50,
    price: 140,
    status: 'Available',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_glyco_mm',
    pharmacyId: 'sample_pharmacy_mangalore_medicals',
    medicineName: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride (Glycomet 500)',
    strength: '500mg',
    category: 'Diabetic Care',
    quantity: 90,
    price: 36,
    status: 'Available',
    isPrescriptionRequired: true,
    isSampleData: true,
  },

  // City Care Pharmacy inventory
  {
    id: 'sample_med_dolo_cc',
    pharmacyId: 'sample_pharmacy_city_care',
    medicineName: 'Paracetamol 650mg',
    genericName: 'Paracetamol (Dolo 650mg)',
    strength: '650mg',
    category: 'Analgesics & Antipyretic',
    quantity: 5,
    price: 30,
    status: 'Low Stock',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
  {
    id: 'sample_med_cetzine_cc',
    pharmacyId: 'sample_pharmacy_city_care',
    medicineName: 'Cetirizine 10mg',
    genericName: 'Cetirizine (Alerid 10mg)',
    strength: '10mg',
    category: 'Antihistamines',
    quantity: 75,
    price: 22,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
  {
    id: 'sample_med_amox_cc',
    pharmacyId: 'sample_pharmacy_city_care',
    medicineName: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate (Novamox 500)',
    strength: '500mg',
    category: 'Antibiotics',
    quantity: 32,
    price: 85,
    status: 'Available',
    isPrescriptionRequired: true,
    isSampleData: true,
  },
  {
    id: 'sample_med_ors_cc',
    pharmacyId: 'sample_pharmacy_city_care',
    medicineName: 'ORS Electrolyte Sachet',
    genericName: 'Oral Rehydration Salts IP (Electral)',
    strength: '21.8g Sachet',
    category: 'Hydration & Electrolytes',
    quantity: 150,
    price: 21,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },

  // Metro Health (Pending pharmacy - must not show in user search until approved!)
  {
    id: 'sample_med_dolo_metro',
    pharmacyId: 'sample_pharmacy_metro_pending',
    medicineName: 'Paracetamol 650mg',
    genericName: 'Paracetamol IP (Dolo 650)',
    strength: '650mg',
    category: 'Analgesics & Antipyretic',
    quantity: 100,
    price: 25,
    status: 'Available',
    isPrescriptionRequired: false,
    isSampleData: true,
  },
];

/**
 * Seed sample pharmacies and medicines directly into Firestore
 */
export async function seedSampleData() {
  const batch = writeBatch(db);

  // Add pharmacies
  for (const pharmacy of SAMPLE_PHARMACIES) {
    const docRef = doc(db, 'pharmacies', pharmacy.id);
    batch.set(
      docRef,
      {
        ...pharmacy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  // Add medicines
  for (const medicine of SAMPLE_MEDICINES) {
    const docRef = doc(db, 'medicines', medicine.id);
    batch.set(
      docRef,
      {
        ...medicine,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  return {
    pharmaciesCount: SAMPLE_PHARMACIES.length,
    medicinesCount: SAMPLE_MEDICINES.length,
  };
}

/**
 * Clear sample data from Firestore
 */
export async function clearSampleData() {
  const batch = writeBatch(db);

  // Find sample pharmacies
  const qPharmacies = query(
    collection(db, 'pharmacies'),
    where('isSampleData', '==', true)
  );
  const snapPharmacies = await getDocs(qPharmacies);
  snapPharmacies.forEach((d) => batch.delete(d.ref));

  // Find sample medicines
  const qMeds = query(
    collection(db, 'medicines'),
    where('isSampleData', '==', true)
  );
  const snapMeds = await getDocs(qMeds);
  snapMeds.forEach((d) => batch.delete(d.ref));

  await batch.commit();
  return {
    deletedPharmacies: snapPharmacies.size,
    deletedMedicines: snapMeds.size,
  };
}
