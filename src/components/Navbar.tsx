import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Compass, User, Zap, HeartHandshake, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'explore' | 'dashboard' | 'matches';
  setActiveTab: (tab: 'home' | 'explore' | 'dashboard' | 'matches') => void;
  currentUser: UserType | null;
  usersCount: number;
  perfectMatchesCount: number;
  pendingSwapsCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  usersCount,
  perfectMatchesCount,
  pendingSwapsCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full px-4 py-4 md:px-8 bg-[#030014]/75 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-[#0a0b10]/60 p-2 pl-4 pr-3 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5">
        
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex cursor-pointer items-center gap-2.5 group"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-500">
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#030014]">
              <Terminal className="h-5 w-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display text-lg font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-none">
              SWAPIO
            </span>
            <span className="font-mono text-[9px] tracking-widest text-purple-300 uppercase leading-none mt-1">
              TECH EXPO v2.6
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Zap className={`h-4 w-4 ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-400'}`} />
            Home
          </button>

          <button
            id="nav-link-explore"
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Compass className={`h-4 w-4 ${activeTab === 'explore' ? 'text-purple-400' : 'text-gray-400'}`} />
            Explore Swaps
          </button>

          <button
            id="nav-link-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <User className={`h-4 w-4 ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-gray-400'}`} />
            My Dashboard
          </button>

          <button
            id="nav-link-matches"
            onClick={() => setActiveTab('matches')}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <HeartHandshake className={`h-4 w-4 ${activeTab === 'matches' ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
            Transmission Hub
            {pendingSwapsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 text-black font-bold font-mono text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {pendingSwapsCount}
              </span>
            )}
          </button>
        </div>

        {/* STATUS AND USER PILL */}
        <div className="flex items-center gap-2.5">
          {/* Active stats badge */}
          <div className="hidden lg:flex items-center gap-2.5 rounded-xl bg-purple-950/20 px-3.5 py-1.5 border border-purple-500/10 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-gray-300">
              <span className="text-emerald-400 font-bold">{usersCount}</span> Devs
            </span>
            {perfectMatchesCount > 0 && (
              <>
                <span className="text-white/10">|</span>
                <span className="text-cyan-400 font-bold glow-text-cyan animate-pulse">{perfectMatchesCount} Perfects</span>
              </>
            )}
          </div>

          {/* User mini pill */}
          {currentUser && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-950/30 to-[#0a0b10] border border-cyan-500/10 px-3 py-1.5 rounded-xl cursor-pointer hover:border-cyan-400/40 hover:bg-purple-950/40 transition-all duration-300"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-6.5 h-6.5 rounded-lg border border-purple-500/30 object-cover"
              />
              <span className="hidden sm:inline text-xs font-bold text-gray-200">{currentUser.name.split(' ')[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAVIGATION PILLS */}
      <div className="mt-3 flex justify-center gap-1.5 md:hidden">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 rounded-xl py-2.5 text-center font-display text-xs font-bold transition-all duration-300 border ${
            activeTab === 'home' 
              ? 'bg-purple-950/30 text-purple-300 border-purple-500/30 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' 
              : 'bg-[#0a0b10]/40 text-gray-400 border-transparent'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 rounded-xl py-2.5 text-center font-display text-xs font-bold transition-all duration-300 border ${
            activeTab === 'explore' 
              ? 'bg-purple-950/30 text-purple-300 border-purple-500/30 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' 
              : 'bg-[#0a0b10]/40 text-gray-400 border-transparent'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 rounded-xl py-2.5 text-center font-display text-xs font-bold transition-all duration-300 border ${
            activeTab === 'dashboard' 
              ? 'bg-purple-950/30 text-purple-300 border-purple-500/30 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' 
              : 'bg-[#0a0b10]/40 text-gray-400 border-transparent'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`relative flex-1 rounded-xl py-2.5 text-center font-display text-xs font-bold transition-all duration-300 border ${
            activeTab === 'matches' 
              ? 'bg-purple-950/30 text-purple-300 border-purple-500/30 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' 
              : 'bg-[#0a0b10]/40 text-gray-400 border-transparent'
          }`}
        >
          Hub
          {pendingSwapsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          )}
        </button>
      </div>
    </header>
  );
}
