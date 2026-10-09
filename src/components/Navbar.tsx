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
  ChevronDown,
  Home,
  Building2,
  BarChart3,
  User,
  LogIn
} from 'lucide-react';
import { UserProfile, WeatherData, NavigationPage } from '../types';
import { DEMO_USERS } from '../services/storageService';

interface Props {
  activeTab: NavigationPage;
  setActiveTab: (tab: NavigationPage) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  weather: WeatherData | null;
  savedCount: number;
  pendingReportsCount: number;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  weather,
  savedCount,
  pendingReportsCount,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'explore' as const, label: 'Explore', icon: <MapPin className="w-4 h-4" /> },
    { id: 'places' as const, label: 'Places', icon: <Building2 className="w-4 h-4" /> },
    { id: 'planner' as const, label: 'AI Planner', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'compare' as const, label: 'Compare', icon: <Columns3 className="w-4 h-4" /> },
    { 
      id: 'reports' as const, 
      label: 'Reports', 
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    { id: 'insights' as const, label: 'Insights', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
    { 
      id: 'saved' as const, 
      label: 'Saved', 
      icon: <Bookmark className="w-4 h-4 text-emerald-400" />,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    { 
      id: 'admin' as const, 
      label: 'Admin', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      restricted: currentUser.role === 'explorer',
    },
  ];

  const handleSelectTab = (tab: NavigationPage) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleSelectTab('home')}>
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
                <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden xl:block">
                Less Survival Mode. <span className="text-cyan-400">More Adventure.</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.restricted) return null;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Weather Quick Pill & User Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Weather Quick Indicator */}
            {weather && (
              <div 
                className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300"
                title={`${weather.condition} - ${weather.recommendation}`}
              >
                <CloudSun className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">{weather.temp_c}°C</span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {weather.outdoor_score}% Outdoor
                </span>
              </div>
            )}

            {/* Auth / Profile Button */}
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
                <span className="font-semibold text-slate-200 hidden sm:inline max-w-[90px] truncate">
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

              {/* Account Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 glass-dropdown rounded-2xl p-2.5 z-50 shadow-2xl border border-slate-700/80 animate-slide-up">
                  {/* Current User Snapshot */}
                  <div className="p-3 bg-slate-800/60 rounded-xl mb-2 border border-slate-700/50">
                    <p className="font-bold text-white text-sm truncate">{currentUser.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email || 'explorer@explorecity.app'}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-amber-400 font-semibold">{currentUser.reputation_score} Reputation</span>
                      <span className="text-slate-400">{currentUser.badge}</span>
                    </div>
                  </div>

                  {/* Profile & Saved Quick Links */}
                  <div className="space-y-1 mb-2 pb-2 border-b border-slate-700/60">
                    <button
                      onClick={() => handleSelectTab('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>My Profile & Reputation</span>
                    </button>
                    <button
                      onClick={() => handleSelectTab('saved')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-emerald-400" />
                      <span>Saved Places &amp; Itineraries</span>
                      {savedCount > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {savedCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <span>Log In / Sign Up Modal</span>
                    </button>
                  </div>

                  {/* Switch Persona Section */}
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold px-2 py-1">
                    Demo Role Switcher (RBAC)
                  </p>
                  <div className="space-y-1">
                    {Object.values(DEMO_USERS).map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
                          currentUser.id === user.id
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name} 
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate text-xs">{user.full_name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{user.role} · {user.badge}</p>
                        </div>
                        {currentUser.id === user.id && (
                          <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-5 space-y-1.5 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Explore City Navigation
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              Less Survival Mode. More Adventure.
            </span>
          </div>

          {navItems.map((item) => {
            if (item.restricted) return null;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => handleSelectTab('profile')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 text-center hover:bg-slate-700"
            >
              My Profile
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal('login');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-300 text-center hover:bg-amber-500/30"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
