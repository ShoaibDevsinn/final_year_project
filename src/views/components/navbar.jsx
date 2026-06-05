// src/views/components/Navbar.jsx
import { Home, User, TrendingUp, History, Building2, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

// Route constants - easy to maintain
export const ROUTES = {
  HOME: '/',
  LISTINGS: '/listings',
  PREDICT: '/predict',
  HISTORICAL_RATES: '/historical-rates',
  PROFILE: '/profile',
  SIGN_IN: '/sign_in',
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    initial: '',
    avatar: null
  });

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      
      setIsAuthenticated(!!token);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set profile data
        const fullName = parsedUser.username || parsedUser.full_name || parsedUser.email?.split('@')[0] || 'User';
        const email = parsedUser.email || '';
        const initial = fullName.charAt(0).toUpperCase();
        
        setProfile({
          fullName: fullName,
          email: email,
          initial: initial,
          avatar: null
        });
      } else {
        setProfile({
          fullName: '',
          email: '',
          initial: '',
          avatar: null
        });
      }
      
      setIsLoading(false); // ✅ Done loading
    };
    
    checkAuth();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsProfileOpen(false);
    navigate(ROUTES.SIGN_IN);
  };

  // Nav items configuration
  const navItems = useMemo(() => {
    const items = [
      { path: ROUTES.HOME, label: 'Home', icon: Home },
      { path: ROUTES.LISTINGS, label: 'Browse Listing', icon: Building2 },
      { path: ROUTES.PREDICT, label: 'Price Predictor', icon: TrendingUp },
      { path: ROUTES.HISTORICAL_RATES, label: 'Historical Rates', icon: History },
    ];
    
    // Add Sign In only when NOT authenticated
    if (!isAuthenticated) {
      items.push({ path: ROUTES.SIGN_IN, label: 'Sign In', icon: User });
    }
    
    return items;
  }, [isAuthenticated]);

  // Check if nav item is active
  const isActivePath = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  // ✅ Show simple loading state
  if (isLoading) {
    return (
      <nav className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-2">
            <Home className="w-7 h-7 sm:w-8 sm:h-8" />
            <div>
              <div className="font-bold text-lg sm:text-xl">Lahore Property</div>
              <div className="text-xs text-emerald-100 hidden sm:block">Find Your Dream Home</div>
            </div>
          </div>
          <div className="w-20 h-8 bg-white/20 rounded "></div>
        </div>
      </nav>
    );
  }

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
          
          {/* Profile Avatar with Dropdown - Only when authenticated */}
          {isAuthenticated && (
            <div className="relative profile-dropdown ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-emerald-700 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">
                  {profile.initial}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{profile.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                  </div>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
            
            {/* Mobile Profile Section when authenticated */}
            {isAuthenticated && (
              <>
                <div className="border-t border-emerald-500 my-2"></div>
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold">
                      {profile.initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{profile.fullName}</p>
                      <p className="text-xs text-emerald-100">{profile.email}</p>
                    </div>
                  </div>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-emerald-700"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-red-600 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}