// src/views/components/Navbar.jsx
import { Home, User, TrendingUp, History, Shield, Building2, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';

// Route constants - easy to maintain
export const ROUTES = {
  HOME: '/',
  LISTINGS: '/listings',
  PREDICT: '/predict',
  HISTORICAL_RATES: '/historical-rates',
  PROFILE: '/profile',
  ADMIN: '/admin',
  SIGN_IN: '/sign_in',
};

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Nav items configuration
  const navItems = useMemo(() => [
    { path: ROUTES.HOME, label: 'Home', icon: Home },
    { path: ROUTES.LISTINGS, label: 'Browse Listing', icon: Building2 },
    { path: ROUTES.PREDICT, label: 'Price Predictor', icon: TrendingUp },
    { path: ROUTES.HISTORICAL_RATES, label: 'Historical Rates', icon: History },
    { path: ROUTES.PROFILE, label: 'Profile', icon: User },
    { path: ROUTES.SIGN_IN, label: 'Sign In', icon: User },
    // { path: ROUTES.ADMIN, label: 'Admin', icon: Shield },
  ], []);

  // Check if nav item is active
  const isActivePath = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  return (
    <nav className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 w-full">
        {/* Logo */}
        <Link 
          to={ROUTES.HOME} 
          className="flex items-center gap-2 group" 
          onClick={() => setIsMenuOpen(false)}
        >
          <Home className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
          <div>
            <div className="font-bold text-lg sm:text-xl">Lahore Property</div>
            <div className="text-xs text-emerald-100 hidden sm:block">
              Find Your Dream Home
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-emerald-700 font-medium shadow-md'
                    : 'hover:bg-emerald-700 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-emerald-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden w-full px-4 sm:px-6 lg:px-8 pb-4 pt-2 border-t border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-700">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-emerald-700 font-medium'
                      : 'hover:bg-emerald-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}