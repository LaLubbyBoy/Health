import React, { useState } from 'react';
import { 
  Activity, Calendar, Video, Pill, FlaskConical, BookOpen, 
  User as UserIcon, LogOut, ShieldCheck, ChevronDown, Menu, X, Building2, Stethoscope, Bot 
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, currentUser, onOpenAuth, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'doctors', label: 'Find Doctor', icon: Stethoscope },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'telemedicine', label: 'Telemedicine', icon: Video },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
    { id: 'ai-assistant', label: 'AI Health Assistant', icon: Bot },
    { id: 'articles', label: 'Health Articles', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 text-white">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent">MEDICARE</span>
                <span className="text-xl font-light text-teal-600">CONNECT</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Better Healthcare. Easier Access.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Auth & Dashboard Action */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-emerald-700 uppercase font-semibold">{currentUser.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-emerald-700" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button 
                      onClick={() => { setCurrentTab('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 flex items-center space-x-2 font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <span>My Dashboard</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onOpenAuth}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm px-4 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={onOpenAuth}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition duration-200"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center space-x-3">
            {currentUser && (
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow"
              >
                {currentUser.name.charAt(0)}
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
            {currentUser ? (
              <button 
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
