import { useEffect, useState } from 'react';
import { CATALOG_EVENT, OWNER_INVENTORY_KEY } from '../services/ownerInventoryService';

/** Re-render when the store owner saves inventory in this tab or another tab. */
export function useCatalogVersion() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const bump = () => setVersion((value) => value + 1);
    const onStorage = (event) => {
      if (event.key === OWNER_INVENTORY_KEY) bump();
    };
    window.addEventListener(CATALOG_EVENT, bump);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CATALOG_EVENT, bump);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return version;
}
