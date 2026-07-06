import React from 'react';
import { Sparkles, Terminal, Layers, Compass, User, Zap } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userOffersCount: number;
}

export default function Navbar({ currentPage, setCurrentPage, userOffersCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-dark-panel/60 p-2 pl-6 pr-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md border border-white/5">
        
        {/* LOGO */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex cursor-pointer items-center gap-2"
          id="nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-dark-surface">
              <Terminal className="h-4.5 w-4.5 text-neon-cyan" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              SKILL<span className="text-neon-cyan">X</span>CHANGE
            </span>
            <span className="font-mono text-[9px] tracking-widest text-[#a855f7] uppercase leading-none mt-1">
              TECH EXPO v2.6
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1">
          <button
            id="nav-link-home"
            onClick={() => setCurrentPage('home')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-medium transition-all duration-300 ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-white border border-neon-cyan/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Zap className="h-4 w-4 text-neon-cyan" />
            Home
          </button>

          <button
            id="nav-link-explore"
            onClick={() => setCurrentPage('explore')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-medium transition-all duration-300 ${
              currentPage === 'explore'
                ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-white border border-neon-cyan/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Compass className="h-4 w-4 text-neon-purple" />
            Explore Skills
          </button>

          <button
            id="nav-link-dashboard"
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-medium transition-all duration-300 ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-white border border-neon-cyan/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <User className="h-4 w-4 text-neon-cyan" />
            My Dashboard
          </button>
        </div>

        {/* STATS / MOBILE SWITCH */}
        <div className="flex items-center gap-3">
          {/* Active Skill Count Glow badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            <span className="font-mono text-xs text-gray-300">
              Expo Hub Active
            </span>
          </div>

          {/* Core Navigation trigger button style */}
          <button
            id="nav-action-dashboard-p"
            onClick={() => setCurrentPage(currentPage === 'dashboard' ? 'explore' : 'dashboard')}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple px-4 py-2 font-display text-xs font-semibold text-dark-surface uppercase tracking-wider transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            {currentPage === 'dashboard' ? 'Swap Hub' : 'My Dashboard'}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV ACCORDION BAR */}
      <div className="mt-2 flex justify-center gap-2 md:hidden">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex-1 rounded-xl py-2 text-center font-display text-xs font-medium ${
            currentPage === 'home' ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20' : 'bg-dark-panel/40 text-gray-400 border border-transparent'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('explore')}
          className={`flex-1 rounded-xl py-2 text-center font-display text-xs font-medium ${
            currentPage === 'explore' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-dark-panel/40 text-gray-400 border border-transparent'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex-1 rounded-xl py-2 text-center font-display text-xs font-medium ${
            currentPage === 'dashboard' ? 'bg-neon-purple/10 text-neon-cyan border border-neon-purple/20' : 'bg-dark-panel/40 text-gray-400 border border-transparent'
          }`}
        >
          Dashboard
        </button>
      </div>
    </header>
  );
}
