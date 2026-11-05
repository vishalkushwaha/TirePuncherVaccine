import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Building2, Users, MapPin,
  Newspaper, Image, BookOpen, Star, HelpCircle, Award, Flag,
  Settings, UserCheck, LogOut, ExternalLink, Menu, X, MessageSquare, Palette,
  Sliders, ShoppingCart, AlertTriangle, BarChart3, PackageCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAuthenticated, loading, logout, isOwner } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/business-mode', label: 'Business Mode', icon: Sliders },
    { to: '/admin/orders', label: 'Customer Orders', icon: PackageCheck },
    { to: '/admin/abandoned-carts', label: 'Abandoned Carts', icon: AlertTriangle },
    { to: '/admin/crm', label: 'Central CRM', icon: Users },
    { to: '/admin/analytics', label: 'Funnel Analytics', icon: BarChart3 },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/quotes/retail', label: 'Retail Quotes', icon: ShoppingBag },
    { to: '/admin/quotes/bulk', label: 'Bulk Quotes', icon: Building2 },
    { to: '/admin/distributors', label: 'Distributor Apps', icon: Users },
    { to: '/admin/dealers', label: 'Where to Buy', icon: MapPin },
    { to: '/admin/events', label: 'Events & News', icon: Newspaper },
    { to: '/admin/gallery', label: 'Gallery Albums', icon: Image },
    { to: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
    { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    { to: '/admin/certificates', label: 'Certificates', icon: Award },
    { to: '/admin/pages', label: 'Page Banners', icon: Flag },
    { to: '/admin/messages', label: 'Contact Messages', icon: MessageSquare },
    { to: '/admin/settings', label: 'Site Settings', icon: Settings },
    { to: '/admin/themes', label: 'Theme Studio', icon: Palette },
  ];

  if (isOwner) {
    navItems.push({ to: '/admin/users', label: 'Staff Users', icon: UserCheck });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 bg-navy text-white p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-slate-300"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-sm">TPV Admin CMS</span>
        </div>
        <Link to="/" target="_blank" className="text-xs text-cyan-300 flex items-center gap-1">
          <span>Live Site</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-navy text-slate-300 flex flex-col justify-between p-4 z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } border-r border-slate-700/60`}
      >
        <div className="space-y-6 overflow-y-auto min-h-0">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 px-2 py-1 border-b border-slate-700/60 pb-4">
            <img src="/assets/logo.png" alt="Tyre Puncture Vaccine Logo" className="h-11 w-11 object-contain shrink-0" />
            <div>
              <span className="block font-bold text-white text-sm">TPV Admin</span>
              <span className="block text-[10px] text-cyan-400 font-semibold uppercase">Ujjala Electricals</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="pt-4 border-t border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div>
              <span className="block font-bold text-white truncate max-w-[150px]" title={user?.full_name || user?.username}>{user?.full_name || user?.username}</span>
              <span className="block text-[10px] text-emerald-400 capitalize">{user?.role}</span>
            </div>
            <Link
              to="/"
              target="_blank"
              title="Open Public Website"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md"
            >
              <ExternalLink size={14} />
            </Link>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

