import React, { useState } from 'react';
import { useApp } from '../../services/store';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Bot,
  Home,
  Users,
  Compass,
  FileText,
  Activity,
  Flame,
  LifeBuoy,
  User,
  Menu,
  X,
  Languages,
  CheckCircle2,
  ChevronDown,
  Bell,
  MessageSquare,
  PhoneCall,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPath,
    navigate,
    user,
    isAuthenticated,
    logout,
    quickDemoLogin,
    activeAlertsCount,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    updateUser,
    t,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Persistent navigation items requested in spec
  const mainNavLinks = [
    { path: '/dashboard', label: 'Home', icon: Home, authRequired: true },
    { path: '/map', label: 'Map', icon: Compass, authRequired: true },
    { path: '/alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount, authRequired: true },
    { path: '/safety-assistant', label: 'Copilot', icon: Bot, isAi: true, authRequired: true },
    { path: '/chat', label: 'AI Chat', icon: MessageSquare, authRequired: true },
    { path: '/contacts', label: 'Emergency Help', icon: PhoneCall, isEmergency: true },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setNotifMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 text-slate-100">
      {/* Top Status Ticker */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE • SATELLITE DISASTER INGEST ACTIVE
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <span>Verified Feeds:</span>
            <span className="text-slate-300 font-medium">IMD • NDMA SACHET • CWC • USGS • NOAA</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:112"
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency: <strong className="text-white underline">112</strong></span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleLinkClick(isAuthenticated ? '/dashboard' : '/')}
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  AlertSphere AI
                </span>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20">
                  CIVIL SAFETY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                "Be Aware. Be Prepared. Be Safe."
              </p>
            </div>
          </div>

          {/* Desktop Persistent Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);

              if (item.authRequired && !isAuthenticated) return null;

              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  } ${item.isEmergency ? 'text-amber-300 hover:text-amber-200' : ''}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      item.isAi ? 'text-teal-400' : isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Link to Sim Lab */}
            {isAuthenticated && (
              <button
                onClick={() => handleLinkClick('/simulation-lab')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  currentPath === '/simulation-lab'
                    ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40'
                    : 'text-purple-300 hover:bg-slate-800/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>Sim Lab 🧪</span>
              </button>
            )}
          </nav>

          {/* Right Tools: Notification Bell + Language + Role/Auth */}
          <div className="flex items-center gap-2">
            {/* Notification Center Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifMenuOpen(!notifMenuOpen);
                    setLangMenuOpen(false);
                    setUserMenuOpen(false);
                  }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 relative transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-300" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl py-3 z-50 animate-fade-in">
                    <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span>Safety Notifications ({notifications.length})</span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-cyan-400 hover:underline font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2 space-y-1.5 scrollbar-none">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-500">No notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) handleLinkClick(n.link);
                            }}
                            className={`p-3 rounded-2xl text-xs transition cursor-pointer flex items-start gap-2.5 ${
                              !n.read
                                ? 'bg-slate-800/80 border border-cyan-500/30'
                                : 'bg-slate-850 hover:bg-slate-800'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                n.severity === 'EXTREME'
                                  ? 'bg-red-500'
                                  : n.severity === 'HIGH'
                                  ? 'bg-orange-500'
                                  : 'bg-cyan-500'
                              }`}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-xs">{n.title}</h4>
                              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">{n.createdAt}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setNotifMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 transition cursor-pointer"
                title="Change Language"
              >
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase text-[11px] font-bold">{user.language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl py-1 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      updateUser({ language: 'en' });
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 cursor-pointer ${
                      user.language === 'en' ? 'text-cyan-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      updateUser({ language: 'hi' });
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 cursor-pointer ${
                      user.language === 'hi' ? 'text-cyan-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => {
                      updateUser({ language: 'mr' });
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 cursor-pointer ${
                      user.language === 'mr' ? 'text-cyan-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              )}
            </div>

            {/* User Profile & Role Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifMenuOpen(false);
                    setLangMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.role === 'responder'
                        ? 'bg-amber-400'
                        : user.role === 'admin'
                        ? 'bg-purple-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleLinkClick('/profile')}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Profile & Locations</span>
                      </button>

                      <button
                        onClick={() => handleLinkClick('/settings')}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings & Privacy</span>
                      </button>

                      <button
                        onClick={() => handleLinkClick('/command-center')}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        <span>Responder Ops Center</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleLinkClick('/signup')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1.5 animate-fade-in">
          {mainNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            if (item.authRequired && !isAuthenticated) return null;

            return (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-blue-600/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <button
                onClick={() => handleLinkClick('/profile')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-900"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Profile & Preferences</span>
              </button>
              <button
                onClick={() => handleLinkClick('/settings')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-900"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => handleLinkClick('/simulation-lab')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-purple-300 hover:bg-slate-900"
              >
                <Flame className="w-4 h-4 text-purple-400" />
                <span>Disaster Simulation Lab</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-red-400 hover:bg-slate-900 font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => handleLinkClick('/login')}
                className="flex-1 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Log In
              </button>
              <button
                onClick={() => handleLinkClick('/signup')}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
