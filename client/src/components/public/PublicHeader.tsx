import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Lock, HeartHandshake } from 'lucide-react';
import { SiteSettings } from '../../types/index.js';

interface Props {
  settings?: SiteSettings | null;
}

export const PublicHeader: React.FC<Props> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'मुख्यपृष्ठ', path: '/' },
    { label: 'मंडळाबद्दल', path: '/about' },
    { label: 'सदस्य', path: '/members' },
    { label: 'मासिक वर्गणी', path: '/monthly-contributions' },
    { label: 'उत्सव वर्गणी', path: '/events' },
    { label: 'खर्च', path: '/expenses' },
    { label: 'सभा नोंद', path: '/meetings' },
    { label: 'छायाचित्रे', path: '/gallery' },
    { label: 'संपर्क', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm transition-all">
      {/* Top Banner (Reg info & Contact) */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold">अधिकृत</span>
            <span>{settings?.regNumberMarathi || 'रजि. क्र.: महाराष्ट्र/०१३/२०२०/रत्ना. (महाराष्ट्र राज्य)'}</span>
          </div>
          <div className="flex items-center space-x-4 text-orange-100">
            {settings?.primaryPhone && (
              <a href={`tel:${settings.primaryPhone}`} className="flex items-center space-x-1 hover:text-white transition">
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.primaryPhone}</span>
              </a>
            )}
            <Link to="/admin/login" className="flex items-center space-x-1 hover:text-white transition bg-black/15 px-2 py-0.5 rounded text-[11px]">
              <Lock className="w-3 h-3" />
              <span>कार्यकारी मंडळ लॉगिन</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Mandal Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-md bg-white flex-shrink-0 flex items-center justify-center p-0.5">
              <img
                src={settings?.logoUrl || '/logo.png'}
                alt="चौकीचीवाडी मंडळ लोगो"
                className="w-full h-full object-contain rounded-full group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition">
                {settings?.mandalNameMarathi || 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ'}
              </h1>
              <p className="text-xs text-orange-600 font-semibold tracking-wide">
                साखर चौकीचीवाडी (युवा ग्रुप) • ता. खेड, जि. रत्नागिरी
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-orange-100 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2.5 rounded-lg w-full justify-center"
              >
                <Lock className="w-4 h-4" />
                <span>व्यवस्थापन (Admin Panel)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
