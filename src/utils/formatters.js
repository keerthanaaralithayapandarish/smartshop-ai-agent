/**
 * Format currency in Indian Rupees (INR)
 * @param {number|string} amount
 * @returns {string} e.g. "₹25" or "₹149.50"
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format timestamp (Firestore Timestamp, Date, or ISO string)
 * @param {any} timestamp
 * @returns {string} e.g. "Just now", "5 mins ago", "Oct 12, 2026"
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';

  let date;
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return 'Recently';
  }

  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get status details (label, color classes, icon identifier)
 * @param {string} status 'Available' | 'Low Stock' | 'Out of Stock'
 * @param {number} [quantity]
 * @returns {{label: string, bg: string, text: string, border: string, dot: string}}
 */
export function getStatusBadge(status, quantity) {
  // If quantity is explicitly 0, it is Out of Stock
  let effectiveStatus = status;
  if (quantity !== undefined && quantity !== null) {
    const q = Number(quantity);
    if (q === 0) effectiveStatus = 'Out of Stock';
    else if (q <= 5 && effectiveStatus === 'Available') effectiveStatus = 'Low Stock';
  }

  switch (effectiveStatus) {
    case 'Available':
      return {
        label: 'Available',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        icon: '🟢',
      };
    case 'Low Stock':
      return {
        label: 'Low Stock',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        icon: '🟡',
      };
    case 'Out of Stock':
      return {
        label: 'Out of Stock',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        icon: '🔴',
      };
    default:
      return {
        label: status || 'Unknown',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        icon: '⚪',
      };
  }
}
