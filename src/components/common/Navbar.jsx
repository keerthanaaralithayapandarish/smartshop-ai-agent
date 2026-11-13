import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Scale,
  MapPin,
  Bot,
  Store,
  UserPlus,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';
import { useOwnerAuth } from '../../context/OwnerAuthContext';

export function Navbar() {
  const { comparisonItems } = useComparison();
  const { owner, isOwner, logout: logoutOwner } = useOwnerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const ownerDropdownRef = useRef(null);

  // Close owner dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) {
        setOwnerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    {
      name: 'Compare',
      path: '/compare',
      badge: comparisonItems.length > 0 ? comparisonItems.length : null,
    },
    { name: 'Nearby Stores', path: '/nearby', icon: MapPin },
    {
      name: 'AI Assistant',
      path: '/ai-assistant',
      isAi: true,
      badgeText: 'AI',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-subtle transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-electric-950 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden md:inline-flex items-center gap-1.5 text-electric-300">
              <Zap className="w-3.5 h-3.5 text-electric-400 fill-electric-400" />
              Live Multi-Store Price Comparison Engine
            </span>
            <div className="mx-auto md:mx-0 flex items-center gap-2">
              <span className="opacity-90">Comparing Amazon, Flipkart, Croma & Local Retailers in Real-Time</span>
              <span className="inline-block px-1.5 py-0.2 rounded bg-electric-500/30 text-electric-300 font-bold text-[10px]">DEMO READY</span>
            </div>
            <span className="hidden lg:inline-block text-slate-300">
              Bangalore • Mumbai • Delhi NCR
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-950 via-navy-900 to-electric-600 flex items-center justify-center text-white shadow-md group-hover:shadow-glow-electric transition-all duration-300">
                <Sparkles className="w-5 h-5 text-electric-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-extrabold tracking-tight text-navy-950 font-sans">
                    SmartShop
                  </span>
                  <span className="text-xl font-extrabold text-electric-600">AI</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Price Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-electric-600 bg-electric-50/80 shadow-xs'
                        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  {link.isAi && (
                    <Bot className="w-4 h-4 text-electric-600 animate-pulse-subtle" />
                  )}
                  <span>{link.name}</span>

                  {link.badge !== null && link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-electric-600 text-white leading-none">
                      {link.badge}
                    </span>
                  )}

                  {link.badgeText && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-gradient-to-r from-electric-600 to-cyan-500 text-white tracking-wider">
                      {link.badgeText}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Quick Search Shortcut */}
              <Link
                to="/products"
                className="p-2 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Compare Quick Pill */}
              <Link
                to="/compare"
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-electric-300 hover:bg-electric-50/50 transition-all"
              >
                <Scale className="w-3.5 h-3.5 text-electric-600" />
                <span>Compare</span>
                {comparisonItems.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-navy-900 text-white text-[10px] font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </Link>

              {/* Store Owner Subtle Access */}
              {isOwner ? (
                <div className="relative" ref={ownerDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/70 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-all"
                    aria-label="Store Owner Portal"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="max-w-[130px] truncate">{owner?.storeName || 'Store Owner'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${
                        ownerDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {ownerDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setOwnerDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Merchant Portal
                        </div>
                        <div className="text-xs font-bold text-navy-950 truncate mt-0.5">
                          {owner?.storeName || 'Store Owner'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{owner?.email}</div>
                      </div>

                      <Link
                        to="/owner"
                        onClick={() => setOwnerDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-electric-600"
                      >
                        <Store className="w-4 h-4 text-electric-600" />
                        <span>Owner Dashboard</span>
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          logoutOwner();
                          setOwnerDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/owner/portal"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-navy-950 hover:border-electric-300 hover:bg-electric-50/50 transition-all shadow-xs"
                  aria-label="Store Owner Portal"
                >
                  <Store className="w-3.5 h-3.5 text-electric-600" />
                  <span>Store Owner</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/compare"
                className="relative p-2 text-slate-600"
                aria-label="Comparison Tray"
              >
                <Scale className="w-5 h-5 text-electric-600" />
                {comparisonItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-navy-950 text-white text-[9px] font-bold flex items-center justify-center">
                    {comparisonItems.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-electric-600 bg-electric-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {link.isAi && <Bot className="w-4 h-4 text-electric-600" />}
                  <span>{link.name}</span>
                </div>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-electric-600 text-white">
                    {link.badge}
                  </span>
                )}
                {link.badgeText && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-electric-600 text-white">
                    {link.badgeText}
                  </span>
                )}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Store Owner Access
              </div>
              {isOwner ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-navy-950 truncate">
                      {owner?.storeName || 'Store Owner'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{owner?.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/owner"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-navy-950 text-white text-xs font-bold"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logoutOwner();
                        setMobileMenuOpen(false);
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/owner/portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-electric-50 border border-electric-200 text-xs font-bold text-navy-950 hover:bg-electric-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-electric-600" />
                      <span>Store Owner Portal</span>
                    </div>
                    <span className="text-electric-600 font-extrabold">Open Options →</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/owner/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 px-3 text-center rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-electric-600" />
                      <span>Register</span>
                    </Link>
                    <Link
                      to="/owner/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 px-3 text-center rounded-xl bg-navy-950 text-white text-xs font-bold hover:bg-navy-900 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Owner Login</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
