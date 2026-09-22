import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UserCheck,
  Package,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-spice-cream/95 backdrop-blur-md border-b border-spice-saffron/20 shadow-sm transition-all overflow-x-clip">
      {/* Top Bar with Real Contact & Address Information */}
      <div className="bg-spice-dark text-spice-beige py-1.5 px-4 text-xs font-medium border-b border-spice-turmeric/30">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          {/* Left: Factory & Corporate Address + Phone */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-spice-cream">
              <MapPin className="w-3.5 h-3.5 text-spice-turmeric shrink-0" />
              <span>Choudhury Bazar, Cuttack, Odisha - 753001</span>
            </span>
            <span className="hidden md:inline text-spice-cream/70">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-spice-cream">
              <Phone className="w-3.5 h-3.5 text-spice-turmeric shrink-0" />
              <span>+91 94370 12345 / 0671 2304958</span>
            </span>
          </div>

          {/* Right: Quality Verification Link */}
          <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-xs">
            <span className="text-spice-turmeric font-semibold hidden lg:inline">
              100% Pure Stone-Ground Odia Spices
            </span>
            <Link
              to="/quality"
              className="flex items-center gap-1 text-spice-turmeric hover:text-white font-bold transition-colors underline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Batch Quality →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 lg:gap-6">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center shrink-0 group pr-4 sm:pr-6 border-r border-spice-brown/15">
            <img
              src="/images/brand/logo.webp"
              alt="Subhadarshini Spices & Foods"
              className="h-10 sm:h-12 md:h-13 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 lg:gap-7 text-sm font-semibold text-spice-brown shrink-0 ml-2 lg:ml-6 mr-auto">
            <Link
              to="/"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative ${
                isActive('/') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/products"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative ${
                isActive('/products') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Products
              {isActive('/products') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/recipes"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative flex items-center gap-1.5 ${
                isActive('/recipes') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Recipes
              <span className="text-[9px] bg-brand-50 text-spice-red font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                AI
              </span>
              {isActive('/recipes') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/quality"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative flex items-center gap-1.5 ${
                isActive('/quality') ? 'text-spice-red font-bold' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-spice-saffron" />
              Traceability
              {isActive('/quality') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/about"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative ${
                isActive('/about') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Our Story
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/dealers"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative ${
                isActive('/dealers') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Dealers
              {isActive('/dealers') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>

            <Link
              to="/wholesale"
              className={`hover:text-spice-red transition-colors whitespace-nowrap py-2 relative ${
                isActive('/wholesale') ? 'text-spice-red font-bold' : ''
              }`}
            >
              Wholesale
              {isActive('/wholesale') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-red rounded-full" />
              )}
            </Link>
          </nav>

          {/* Action Tools & Icons (Standardized 5x5 Icon Sizes, Zero Overflow) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 pl-2 sm:pl-4 border-l border-spice-brown/10">
            
            {/* Search Bar (Expandable on large screens) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 xl:w-44 focus:w-56 text-xs py-2 pl-8 pr-3 rounded-full bg-white border border-spice-brown/20 focus:outline-none focus:border-spice-saffron focus:ring-1 focus:ring-spice-saffron transition-all duration-300"
              />
              <Search className="w-4 h-4 text-spice-brown/50 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Wishlist Button */}
            <Link
              to="/profile"
              title="Wishlist"
              className="relative p-2 text-spice-brown hover:text-spice-red transition-colors rounded-full hover:bg-spice-brown/5 flex items-center justify-center"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-spice-saffron text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              title="Shopping Cart"
              className="relative flex items-center gap-1.5 p-2 text-spice-brown hover:text-spice-red transition-colors rounded-full hover:bg-spice-brown/5 group"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-spice-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartTotal > 0 && (
                <span className="hidden xl:inline text-xs font-bold text-spice-brown group-hover:text-spice-red">
                  ₹{cartTotal}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login Icon Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-spice-brown/5 hover:bg-spice-brown/10 text-spice-brown text-xs font-bold transition-all border border-spice-brown/10"
                >
                  <UserCheck className="w-4 h-4 text-spice-red" />
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-ink-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-spice-brown/10 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-spice-brown/10">
                      <p className="font-bold text-spice-brown truncate">{user.name}</p>
                      <p className="text-[11px] text-ink-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold bg-brand-50 text-spice-red rounded-md uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-spice-brown hover:bg-spice-beige transition-colors"
                    >
                      <User className="w-4 h-4 text-spice-saffron" />
                      My Profile
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-spice-brown hover:bg-spice-beige transition-colors"
                    >
                      <Package className="w-4 h-4 text-spice-saffron" />
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-spice-red font-bold hover:bg-spice-red/5 transition-colors border-t border-spice-brown/10"
                      >
                        <LayoutDashboard className="w-4 h-4 text-spice-red" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-spice-red hover:bg-brand-50 transition-colors border-t border-spice-brown/10 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                title="Account Login"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-bold text-spice-red border border-spice-red rounded-full hover:bg-spice-red hover:text-white transition-all shadow-xs shrink-0"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-spice-brown rounded-lg hover:bg-spice-brown/5 transition-colors shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-spice-red" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-spice-cream border-t border-spice-saffron/20 px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-300">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search spices, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-white border border-spice-brown/20 focus:outline-none focus:border-spice-saffron"
            />
            <Search className="w-4 h-4 text-spice-brown/50 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-3 font-semibold text-spice-brown text-base divide-y divide-spice-brown/10">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-2 hover:text-spice-red transition-colors flex items-center justify-between"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors flex items-center justify-between"
            >
              All Products
            </Link>
            <Link
              to="/recipes"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors flex items-center justify-between"
            >
              <span>Recipes</span>
              <span className="text-xs bg-spice-saffron text-white font-bold px-2 py-0.5 rounded-full">AI Assistant</span>
            </Link>
            <Link
              to="/quality"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors flex items-center justify-between"
            >
              <span>Quality Traceability</span>
              <ShieldCheck className="w-4 h-4 text-spice-saffron" />
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="/dealers"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors"
            >
              Dealer Locator
            </Link>
            <Link
              to="/wholesale"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-3 hover:text-spice-red transition-colors"
            >
              Wholesale Enquiries
            </Link>

            {user ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-3 text-spice-brown hover:text-spice-red transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-spice-saffron" />
                My Account ({user.name})
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-3 text-spice-red font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4 text-spice-red" />
                Account Login
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-3 text-spice-red font-bold flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
