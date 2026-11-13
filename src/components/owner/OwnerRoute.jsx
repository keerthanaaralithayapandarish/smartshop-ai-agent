import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOwnerAuth } from '../../context/OwnerAuthContext';

export function OwnerRoute({ children }) {
  const { isOwner } = useOwnerAuth();
  const location = useLocation();

  if (!isOwner) {
    return <Navigate to="/owner/portal" state={{ from: location }} replace />;
  }

  return children;
}
