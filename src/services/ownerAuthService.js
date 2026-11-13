/**
 * SmartShop AI - Store Owner Authentication Service
 * Manages demo and registered store owner profiles in localStorage.
 */

export const OWNER_SESSION_KEY = 'SMARTSHOP_OWNER';
export const REGISTERED_OWNERS_KEY = 'SMARTSHOP_REGISTERED_OWNERS';

export const DEMO_OWNER = {
  ownerName: 'Croma Indiranagar Manager',
  displayName: 'Croma Indiranagar',
  storeName: 'Croma Megastore - Indiranagar',
  email: 'owner@smartshop.ai',
  phone: '+91 80 4930 2200',
  password: 'owner123',
  address: 'No. 772, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
  storeId: 'croma-indiranagar',
};

export function getRegisteredOwners() {
  if (typeof localStorage === 'undefined') return [DEMO_OWNER];
  try {
    const raw = localStorage.getItem(REGISTERED_OWNERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [DEMO_OWNER];
    if (!parsed.some((o) => o.email?.toLowerCase() === DEMO_OWNER.email.toLowerCase())) {
      parsed.unshift(DEMO_OWNER);
    }
    return parsed;
  } catch {
    return [DEMO_OWNER];
  }
}

export function saveRegisteredOwner({ ownerName, storeName, email, phone, password, address }) {
  const cleanOwnerName = String(ownerName || '').trim();
  const cleanStoreName = String(storeName || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPhone = String(phone || '').trim();
  const cleanPassword = String(password || '').trim();
  const cleanAddress = String(address || '').trim();

  if (!cleanOwnerName) throw new Error('Owner name is required.');
  if (!cleanStoreName) throw new Error('Store name is required.');
  if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Valid email address is required.');
  if (!cleanPhone) throw new Error('Phone number is required.');
  if (!cleanPassword || cleanPassword.length < 4) throw new Error('Password must be at least 4 characters.');
  if (!cleanAddress) throw new Error('Store address is required.');

  const currentOwners = getRegisteredOwners();
  if (currentOwners.some((o) => o.email?.toLowerCase() === cleanEmail)) {
    throw new Error('A store owner with this email address is already registered.');
  }

  const storeId =
    cleanStoreName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `store-${Date.now().toString(36)}`;

  const newOwner = {
    ownerName: cleanOwnerName,
    displayName: cleanOwnerName,
    storeName: cleanStoreName,
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPassword,
    address: cleanAddress,
    storeId,
    registeredAt: new Date().toISOString(),
  };

  const updatedOwners = [...currentOwners, newOwner];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(REGISTERED_OWNERS_KEY, JSON.stringify(updatedOwners));
  }

  const session = {
    ownerName: newOwner.ownerName,
    displayName: newOwner.displayName,
    storeName: newOwner.storeName,
    email: newOwner.email,
    phone: newOwner.phone,
    address: newOwner.address,
    storeId: newOwner.storeId,
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(OWNER_SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function validateOwnerLogin(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  if (!normalized || !cleanPassword) {
    throw new Error('Please enter both email and password.');
  }

  const owners = getRegisteredOwners();
  const match = owners.find(
    (o) => o.email?.toLowerCase() === normalized && o.password === cleanPassword
  );

  if (!match) {
    throw new Error('Invalid store owner email or password.');
  }

  const session = {
    ownerName: match.ownerName || match.displayName || 'Store Owner',
    displayName: match.displayName || match.ownerName || 'Store Owner',
    storeName: match.storeName || 'My Store',
    email: match.email,
    phone: match.phone || '',
    address: match.address || '',
    storeId: match.storeId || 'croma-indiranagar',
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(OWNER_SESSION_KEY, JSON.stringify(session));
  }

  return session;
}
