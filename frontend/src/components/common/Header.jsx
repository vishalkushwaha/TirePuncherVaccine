import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, Award, HelpCircle, BookOpen, Image as ImageIcon, Newspaper, ShoppingCart, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useShopConfig } from '../../context/ShopConfigContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { t, isHindi } = useLanguage();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { allowAddToCart, isEcommerceEnabled, isQuotationEnabled } = useShopConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchBarOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/products', label: t('nav.products') },
    { to: '/compare', label: t('nav.compare') },
    { to: '/how-to-use', label: t('nav.howToUse') },
    { to: '/dosage-guide', label: t('nav.dosageGuide') },
    { to: '/distributorship', label: t('nav.distributorship') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const moreLinks = [
    { to: '/events', label: t('nav.events'), icon: Newspaper },
    { to: '/gallery', label: t('nav.gallery'), icon: ImageIcon },
    { to: '/blog', label: t('nav.blog'), icon: BookOpen },
    { to: '/where-to-buy', label: t('nav.whereToBuy'), icon: Award },
    { to: '/faq', label: t('nav.faq'), icon: HelpCircle },
    { to: '/certifications', label: t('nav.certifications'), icon: Award },
    { to: '/testimonials', label: t('nav.testimonials'), icon: Award },
    ...(isEcommerceEnabled ? [{ to: '/track-order', label: isHindi ? 'ऑर्डर ट्रैक करें' : 'Track Order', icon: Truck }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0 py-2 group">
            <img
              src="/assets/logo.png"
              alt="Tyre Puncture Vaccine Logo"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="hidden lg:block xl:hidden 2xl:block">
              <span className="block text-lg font-bold text-navy tracking-tight leading-tight">
                TYRE PUNCTURE VACCINE
              </span>
              <span className="block text-[11px] font-semibold text-cyan-700 tracking-wide">
                UJJALA ELECTRICALS · BIKANER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 font-medium text-sm whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2.5 2xl:px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-cyan-700 bg-cyan-50 font-semibold'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-slate-700 hover:text-cyan-700 hover:bg-slate-50 transition-colors"
              >
                <span>{isHindi ? 'अन्य पृष्ठ' : 'More'}</span>
                <ChevronDown size={14} className={`transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {moreLinks.map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setMoreDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-cyan-700 hover:bg-cyan-50"
                      >
                        <Icon size={14} className="text-cyan-600" />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchBarOpen(!searchBarOpen)}
              aria-expanded={searchBarOpen}
              className="p-2 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-full transition-colors"
              title="Search website"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Shopping Cart Button */}
            {allowAddToCart && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-full transition-colors"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-cyan-700 text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Dynamic CTA Button based on Business Mode */}
            {isQuotationEnabled ? (
              <Link
                to="/quote"
                className="bg-navy hover:bg-cyan-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{t('nav.getQuote')}</span>
              </Link>
            ) : (
              <Link
                to="/products"
                className="bg-navy hover:bg-cyan-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{isHindi ? 'खरीदें' : 'Shop Now'}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Global Search Expandable Bar */}
        {searchBarOpen && (
          <div className="py-3 px-2 border-t border-slate-100 animate-in slide-in-from-top-1">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "प्रोडक्ट, ब्लॉग या समाचार खोजें..." : "Search products, news, blog posts, dosage..."}
                aria-label={isHindi ? "वेबसाइट खोजें" : "Search website"}
                className="min-w-0 flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-600"
                autoFocus
              />
              <button
                type="submit"
                className="bg-cyan-700 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-cyan-800"
              >
                {isHindi ? "खोजें" : "Search"}
              </button>
              <button
                type="button"
                onClick={() => setSearchBarOpen(false)}
                className="text-slate-500 hover:text-slate-800 p-2"
                aria-label={isHindi ? "बंद करें" : "Close search"}
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive
                    ? 'text-cyan-700 bg-cyan-50 font-semibold'
                    : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-2 pb-1 border-t border-slate-100">
            <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'अतिरिक्त पृष्ठ' : 'Explore More'}
            </span>
            {moreLinks.map((sub) => (
              <Link
                key={sub.to}
                to={sub.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-cyan-700 hover:bg-slate-50 rounded-md"
              >
                {sub.label}
              </Link>
            ))}
          </div>

          <div className="pt-3">
            <Link
              to={isQuotationEnabled ? '/quote' : '/products'}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-navy text-white py-3 rounded-lg font-bold shadow-md hover:bg-cyan-700 transition-colors"
            >
              {isQuotationEnabled ? t('nav.getQuote') : (isHindi ? 'खरीदें' : 'Shop Now')}
            </Link>
          </div>
        </div>
      )}

      {/* Cart Drawer Slide-over */}
      <CartDrawer />
    </header>
  );
}

