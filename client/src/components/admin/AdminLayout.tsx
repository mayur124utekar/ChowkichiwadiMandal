import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  Receipt, 
  FileText, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Monthly Contributions', path: '/admin/monthly-contributions', icon: CreditCard },
    { label: 'Festival Contributions', path: '/admin/festival-contributions', icon: Calendar },
    { label: 'Events / Festivals', path: '/admin/events', icon: Calendar },
    { label: 'Expenses', path: '/admin/expenses', icon: Receipt },
    { label: 'Meetings', path: '/admin/meetings', icon: FileText },
    { label: 'Financial Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings, adminOnly: true },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert, adminOnly: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50 font-english">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-orange-500 flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-white truncate">चौकीचीवाडी मंडळ</h1>
            <p className="text-[11px] text-orange-400 font-medium">Admin Management</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.adminOnly && user.role !== 'ADMIN') return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[11px] text-slate-400">{user.role}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {navItems.find((i) => i.path === location.pathname)?.label || 'Admin Control Panel'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
              {user.email}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 text-slate-200">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                  <span className="font-bold text-white text-sm">Chowkichiwadi Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  if (item.adminOnly && user.role !== 'ADMIN') return null;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive(item.path)
                          ? 'bg-orange-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
