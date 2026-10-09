import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  Columns3, 
  Bookmark, 
  ShieldCheck, 
  CloudSun,
  Menu,
  X,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile, WeatherData } from '../types';
import { DEMO_USERS } from '../services/supabaseClient';

interface Props {
  activeTab: 'map' | 'planner' | 'reports' | 'compare' | 'admin' | 'profile';
  setActiveTab: (tab: 'map' | 'planner' | 'reports' | 'compare' | 'admin' | 'profile') => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  weather: WeatherData | null;
  savedCount: number;
  pendingReportsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  weather,
  savedCount,
  pendingReportsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'map' as const, label: 'Explore Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'planner' as const, label: 'AI Trip Planner', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { 
      id: 'reports' as const, 
      label: 'Citizen Reports', 
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    { id: 'compare' as const, label: 'Comparison', icon: <Columns3 className="w-4 h-4" /> },
    { 
      id: 'admin' as const, 
      label: 'Admin Desk', 
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      restricted: currentUser.role === 'explorer',
    },
    { 
      id: 'profile' as const, 
      label: 'Saved & Profile', 
      icon: <Bookmark className="w-4 h-4 text-emerald-400" />,
      badge: savedCount > 0 ? savedCount : undefined,
    },
  ];

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectTab('map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-amber-500 to-cyan-400 p-0.5 shadow-glow-amber">
              <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  Explore<span className="text-gradient-amber">City</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
                Less Survival Mode. <span className="text-cyan-400">More Adventure.</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-amber-400 border border-amber-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.restricted && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Staff
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Weather Quick Pill & User Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Weather Quick Indicator */}
            {weather && (
              <div 
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300"
                title={`${weather.condition} - ${weather.recommendation}`}
              >
                <CloudSun className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">{weather.temp_c}°C</span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {weather.outdoor_score}% Outdoor Score
                </span>
              </div>
            )}

            {/* User Account / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/40 transition-all text-xs"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.full_name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/50"
                />
                <span className="font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {currentUser.full_name.split(' ')[0]}
                </span>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                  currentUser.role === 'admin' 
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40' 
                    : currentUser.role === 'moderator' 
                    ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' 
                    : 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                }`}>
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-700/70 mb-1">
                    <p className="text-[11px] text-slate-400 font-medium">Switch Active Persona / Role</p>
                    <p className="text-xs font-bold text-white mt-0.5">Explore City RBAC</p>
                  </div>

                  {Object.values(DEMO_USERS).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                        currentUser.id === user.id
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <img 
                        src={user.avatar_url} 
                        alt={user.full_name} 
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white truncate">{user.full_name}</p>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {user.reputation_score} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] capitalize text-slate-400">{user.role}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[10px] text-slate-400 truncate">{user.badge}</span>
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <p className="text-[11px] text-slate-400 px-3 py-1 font-semibold uppercase tracking-wider">
            Explore City Navigation
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
