/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Sparkle, 
  CheckCircle2, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Compass, 
  ArrowRight, 
  HeartHandshake, 
  Check, 
  X, 
  Plus, 
  RefreshCw, 
  Star, 
  MessageSquare, 
  Zap, 
  Cpu, 
  Globe, 
  Info,
  Terminal,
  ShieldCheck,
  Award
} from 'lucide-react';
import { User as UserType, Match as MatchType } from './types';

// Predefined available skill ecosystem at Tech Expo 2026
const SKILL_ECOSYSTEM = [
  "React", "TypeScript", "Node.js", "Tailwind CSS", "Framer Motion", 
  "Three.js", "Docker", "Kubernetes", "AWS", "Terraform", "Rust", 
  "Solidity", "Python", "PyTorch", "FastAPI", "Go", "C++", "Assembly", 
  "Figma", "Web3.js", "Express"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'dashboard' | 'matches'>('home');
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOffer, setFilterOffer] = useState('');
  const [filterWant, setFilterWant] = useState('');
  
  // Interaction & UI Loading states
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [proposingId, setProposingId] = useState<string | null>(null);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'info'} | null>(null);
  
  // Stepper active index on landing page
  const [activeStep, setActiveStep] = useState(0);

  // Profile Form states (synchronized to loaded current user)
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formOffers, setFormOffers] = useState<string[]>([]);
  const [formWants, setFormWants] = useState<string[]>([]);
  const [newOfferInput, setNewOfferInput] = useState('');
  const [newWantInput, setNewWantInput] = useState('');

  // Floating terminal modal for mutual swaps
  const [activeSwappingTerminal, setActiveSwappingTerminal] = useState<UserType | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalText, setTerminalText] = useState('');

  // Toast notification system
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial fetch operations
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Parallel fetch for snappy responsiveness
      const [usersRes, currentRes, matchesRes, swapsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/users/current'),
        fetch('/api/matches'),
        fetch('/api/swaps')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
      if (currentRes.ok) {
        const curUser = await currentRes.json();
        setCurrentUser(curUser);
        
        // Initialize profile editing form
        setFormName(curUser.name);
        setFormTitle(curUser.title);
        setFormCompany(curUser.company);
        setFormBio(curUser.bio);
        setFormOffers(curUser.offers);
        setFormWants(curUser.wants);
      }

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      }

      if (swapsRes.ok) {
        const swapsData = await swapsRes.json();
        setSwaps(swapsData);
      }
    } catch (err) {
      console.error('Error fetching data from Node backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync matches when active tab changes to see live computations
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'matches') {
      fetch('/api/matches')
        .then(res => res.json())
        .then(data => setMatches(data))
        .catch(err => console.error(err));
        
      fetch('/api/swaps')
        .then(res => res.json())
        .then(data => setSwaps(data))
        .catch(err => console.error(err));
    }
  }, [activeTab]);

  // Update current user profile online
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const updatedUser = {
        name: formName,
        title: formTitle,
        company: formCompany,
        bio: formBio,
        offers: formOffers,
        wants: formWants
      };

      const res = await fetch('/api/users/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (res.ok) {
        const savedUser = await res.json();
        setCurrentUser(savedUser);
        triggerNotification("Expo Profile synced with cloud backend! Match vectors re-optimized.");
        
        // Refresh matching algorithm results and main user index
        const [matchesRes, usersRes] = await Promise.all([
          fetch('/api/matches'),
          fetch('/api/users')
        ]);
        
        if (matchesRes.ok) setMatches(await matchesRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to sync profile changes", "info");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Propose a swap connection standard workflow
  const handleProposeSwap = async (receiverId: string, receiverName: string) => {
    setProposingId(receiverId);
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId })
      });

      if (res.ok) {
        triggerNotification(`Proposal transmitted to ${receiverName}! Check Matches/Swaps tab.`);
        const swapsRes = await fetch('/api/swaps');
        if (swapsRes.ok) setSwaps(await swapsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProposingId(null);
    }
  };

  // Accept/Decline incoming connection request
  const handleUpdateSwapStatus = async (swapId: string, status: 'accepted' | 'declined', senderName: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        triggerNotification(
          status === 'accepted' 
            ? `Connection securely established with ${senderName}!` 
            : `Swap request declined.`
        );
        
        const swapsRes = await fetch('/api/swaps');
        if (swapsRes.ok) setSwaps(await swapsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add a technical tag to offer list
  const handleAddOfferSkill = (skill: string) => {
    if (skill && !formOffers.includes(skill)) {
      setFormOffers([...formOffers, skill]);
      setNewOfferInput('');
    }
  };

  // Remove a technical tag from offer list
  const handleRemoveOfferSkill = (skill: string) => {
    setFormOffers(formOffers.filter(s => s !== skill));
  };

  // Add a technical tag to wants list
  const handleAddWantSkill = (skill: string) => {
    if (skill && !formWants.includes(skill)) {
      setFormWants([...formWants, skill]);
      setNewWantInput('');
    }
  };

  // Remove a technical tag from wants list
  const handleRemoveWantSkill = (skill: string) => {
    setFormWants(formWants.filter(s => s !== skill));
  };

  // Trigger terminal interaction modal simulating interactive expo swap session
  const openTerminalSession = (matchedUser: UserType) => {
    setActiveSwappingTerminal(matchedUser);
    setTerminalText('');
    setTerminalLogs([
      `[SYS] Establishing cryptographically secure link with ${matchedUser.name}...`,
      `[SYS] Swap compatibility handshake validated. Code-sign matched.`,
      `[SYS] Swapping: You are receiving [${matchedUser.offers.join(', ')}]`,
      `[SYS] Giving: You are offering [${currentUser?.offers.join(', ') || 'N/A'}]`,
      `[SYS] Direct secure channels open. Type a direct message to print log...`
    ]);
  };

  const sendTerminalMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalText.trim()) return;

    setTerminalLogs(prev => [
      ...prev,
      `[USER] Alex Rivera: ${terminalText}`,
      `[SYS] Packet routing... Handled by SWAPIO decentralized dispatcher.`,
      `[REPLY] ${activeSwappingTerminal?.name}: Got it! Let's arrange our discussion meeting inside the expo lounge booth C-4 after the main keynote!`
    ]);
    setTerminalText('');
  };

  // Stepper steps
  const steps = [
    {
      title: "1. Create Developer Capsule",
      desc: "Architect your unique digital expo card. Select the robust frontend, cloud systems, or web3 skills you bring to the sandbox.",
      detail: "Your profile highlights real expert services like TypeScript, Solidity development, or LLM fine-tuning."
    },
    {
      title: "2. Formulate Skill Wants",
      desc: "Declare the bleeding-edge tech paradigms you wish to add to your stack for your active project roadmap.",
      detail: "Define the technologies you need assistance with, such as Kubernetes clusters, AWS orchestration, or PyTorch designs."
    },
    {
      title: "3. Run Real-Time Scanning",
      desc: "Our automated matchmaking engine evaluates other developer vectors to find direct mutual needs.",
      detail: "Computes compatibility indexes instantly. Detects perfect double-handshakes where you have what they need and vice-versa."
    },
    {
      title: "4. Establish Swap & Co-Lab",
      desc: "Secure connection links, review match reports instantly, and step into our integrated secure chat system.",
      detail: "Authorize connection targets to instantly unseal direct exposure contact details, social links, and scheduling plans."
    }
  ];

  // Perfect/highest matches metrics count
  const perfectMatchesCount = matches.filter(m => m.type === 'perfect').length;

  // Filter explore list based on input state
  const filteredUsers = users.filter(user => {
    if (user.isCurrent) return false; // Hide current user in explore list
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      user.name.toLowerCase().includes(query) || 
      user.title.toLowerCase().includes(query) ||
      user.company.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query);

    const matchesOffer = filterOffer 
      ? user.offers.some(o => o.toLowerCase() === filterOffer.toLowerCase())
      : true;

    const matchesWant = filterWant
      ? user.wants.some(w => w.toLowerCase() === filterWant.toLowerCase())
      : true;

    return matchesSearch && matchesOffer && matchesWant;
  });

  return (
    <div id="app-container" className="min-h-screen bg-[#030014] bg-cyber-grid text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-purple-950/15 rounded-full blur-[150px] pointer-events-none" />

      {/* FLOATING SYSTEM TOAST */}
      {notification && (
        <div id="toast-notify" className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-panel-glow px-6 py-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-cyan-400">
            <Sparkle className="w-5 h-5 text-cyan-400 animate-spin" />
            <p className="text-sm font-medium tracking-wide text-gray-200">{notification.message}</p>
          </div>
        </div>
      )}

      {/* DESKTOP-FIRST HUD HEADER */}
      <header id="hud-header" className="sticky top-0 z-40 bg-[#030014]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Status Badge */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-all duration-300">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  SWAPIO
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-cyan-400 opacity-80 uppercase">Tech Expo Sandbox</span>
              </div>
            </div>

            {/* Live Indicator Pillar */}
            <div className="hidden md:flex items-center space-x-2 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-bold">LIVE</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-300">{users.length} Expo Devs</span>
              {perfectMatchesCount > 0 && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-cyan-400 font-bold animate-pulse">{perfectMatchesCount} Perfect Pairs</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'home' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-500/30 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              id="nav-explore"
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'explore' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-500/30 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Swaps</span>
            </button>
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-500/30 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Dashboard</span>
            </button>
            <button
              id="nav-matches"
              onClick={() => {
                setActiveTab('matches');
              }}
              className={`relative px-4 py-2 rounded-lg text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'matches' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-500/30 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Matches / Swaps</span>
              {swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser?.id).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              )}
            </button>
          </nav>

          {/* User Preview mini-pill */}
          {currentUser && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-950/60 to-[#0a0b10] border border-cyan-500/20 px-3 py-1.5 rounded-full cursor-pointer hover:border-cyan-400 transition-all duration-300"
            >
              <img 
                src={currentUser.avatar} 
                alt="user avatar" 
                className="w-6 h-6 rounded-full border border-purple-400 object-cover"
              />
              <span className="hidden lg:inline text-xs font-semibold text-gray-200">{currentUser.name}</span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
            </div>
          )}

        </div>
      </header>

      {/* CORE PAGES VIEWS CONTAINER */}
      <main id="core-view-stage" className="flex-grow max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {loading ? (
          /* Loading Skeleton Indicator */
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-sm font-mono text-cyan-300 tracking-wider">BOOTING CO-LAB PARADIGMS...</p>
          </div>
        ) : (
          <>
            {/* PAGE 1: FUTURISTIC HOME LANDING */}
            {activeTab === 'home' && (
              <div id="view-home" className="space-y-16 animate-fadeIn">
                
                {/* 1. Hero Showcase */}
                <div className="text-center max-w-4xl mx-auto space-y-6 pt-6">
                  <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-purple-300">
                    <Sparkle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TECH EXPO 2026 COMPETITIVE LAUNCHPAD</span>
                  </div>
                  
                  <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none">
                    Unite Vectors.<br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                      Swap Engineering Skills.
                    </span>
                  </h1>

                  <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                    The premium decentralized sandbox designed for expo innovators. Offer your active masteries, request missing paradigms, and unlock instant mutual connection matches.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      id="hero-cta-explore"
                      onClick={() => setActiveTab('explore')}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center space-x-2 text-white"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore Dev Cards</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      id="hero-cta-profile"
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Configure My Profile</span>
                    </button>
                  </div>
                </div>

                {/* Expo Interactive Features Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="glass-panel p-6 rounded-2xl border border-purple-500/10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-100">Smart Pairing Computations</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Instant backend intersection scan pairs you based on mutual needs. Zero time wastage searching manual listings.
                    </p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-cyan-500/10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-100">Frosted Glass Capsules</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Beautiful frosted UI displays what devs Offer & Want with colorful neon tag structures designed to convert.
                    </p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-purple-500/10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-100">Verified Mutual Trust</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Only established pairing accepts unseal contact logs. Prevent spam and exchange engineering insights with confidence.
                    </p>
                  </div>
                </div>

                {/* 2. Interactive "How it Works" Stepper Section */}
                <div className="border border-white/5 rounded-3xl bg-gradient-to-b from-[#0a0c16]/80 to-[#030014] p-6 lg:p-10 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Platform Blueprint</span>
                    <h2 className="font-display font-bold text-3xl text-gray-100">Interactive Swapping Ecosystem</h2>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm">
                      Check interactive stages to visualize how vectors converge.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Stepper Choices */}
                    <div className="col-span-1 lg:col-span-5 space-y-3">
                      {steps.map((step, idx) => (
                        <div 
                          key={idx}
                          id={`step-card-${idx}`}
                          onClick={() => setActiveStep(idx)}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                            activeStep === idx 
                              ? 'bg-purple-950/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                              : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              activeStep === idx ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                            }`}>
                              {idx+1}
                            </span>
                            <h4 className={`font-semibold text-sm tracking-wide ${
                              activeStep === idx ? 'text-white' : 'text-gray-300'
                            }`}>
                              {step.title}
                            </h4>
                          </div>
                          {activeStep === idx && (
                            <p className="text-xs text-gray-400 leading-relaxed mt-2 pl-9 animate-fadeIn">
                              {step.desc}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Interactive Showcase Sandbox Visuals */}
                    <div className="col-span-1 lg:col-span-7 bg-[#131522]/40 rounded-2xl p-6 border border-white/5 aspect-[16/10] flex flex-col justify-between relative overflow-hidden">
                      {/* Grid background */}
                      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-gray-500">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                          <span className="ml-2 font-semibold text-cyan-400">visualizer_node.js</span>
                        </div>
                        <div className="bg-purple-950/50 border border-purple-500/30 text-[9px] font-mono text-purple-300 px-2 py-0.5 rounded">
                          STAGE {activeStep + 1}
                        </div>
                      </div>

                      <div className="my-auto py-4 relative z-10 flex flex-col items-center text-center space-y-4">
                        {activeStep === 0 && (
                          <div className="space-y-3 animate-fadeIn w-full max-w-sm">
                            <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-xl space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                                <span className="text-xs font-mono text-purple-300 font-bold">ALEX RIVERA</span>
                              </div>
                              <p className="text-xs text-gray-400 text-left">TypeScript expert presenting custom high-performance rendering solutions inside the main pavilion.</p>
                              <div className="flex gap-1.5">
                                <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">React</span>
                                <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">TypeScript</span>
                              </div>
                            </div>
                            <span className="text-[11px] text-purple-400 block font-mono">Simulated capsule output schema valid ✓</span>
                          </div>
                        )}

                        {activeStep === 1 && (
                          <div className="space-y-4 animate-fadeIn w-full max-w-sm">
                            <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-xl text-left space-y-2">
                              <h5 className="text-xs font-mono font-bold text-cyan-300">Declared Vector Requirements:</h5>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#131522] border border-white/5 p-1.5 rounded text-xs text-gray-300 flex items-center justify-between">
                                  <span>Rust Systems</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                </div>
                                <div className="bg-[#131522] border border-white/5 p-1.5 rounded text-xs text-gray-300 flex items-center justify-between">
                                  <span>Solidity Web3</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeStep === 2 && (
                          <div className="space-y-3 animate-fadeIn text-center">
                            <div className="flex items-center justify-center space-x-6 relative">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-950 flex items-center justify-center font-bold text-xs text-white">Alex</div>
                                <div className="absolute -top-1 -right-1 bg-purple-500 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold">Offer</div>
                              </div>

                              <div className="flex flex-col items-center">
                                <Sparkle className="w-6 h-6 text-purple-400 animate-spin" />
                                <span className="text-[9px] font-mono text-cyan-300 mt-1">94% Overlap</span>
                              </div>

                              <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-cyan-950 flex items-center justify-center font-bold text-xs text-white">Elena</div>
                                <div className="absolute -top-1 -right-1 bg-cyan-500 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold">Want</div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-300 max-w-md">Perfect mutual double-handshake detected! Alex Rivera and Elena Rostova fulfill each target desires directly.</p>
                          </div>
                        )}

                        {activeStep === 3 && (
                          <div className="space-y-3 animate-fadeIn w-full max-w-sm">
                            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-left space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-emerald-400">UNSEALED CONTACT DETECTED</span>
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              </div>
                              <p className="text-[11px] text-gray-400">Encrypted records resolved. Double-agreement confirmed. Private information released:</p>
                              <div className="space-y-1 text-xs font-mono text-emerald-300 bg-black/40 p-2 rounded">
                                <div>✉ elena@ethersphere.dev</div>
                                <div>🔗 github.com/elena-eth</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <p className="text-[11px] font-mono text-gray-500 text-left">
                          {steps[activeStep].detail}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* PAGE 2: EXPLORE SWAPS CARD GRID */}
            {activeTab === 'explore' && (
              <div id="view-explore" className="space-y-8 animate-fadeIn">
                
                {/* Search / Filters Title */}
                <div className="space-y-1.5">
                  <h2 className="font-display font-black text-3xl tracking-tight text-white flex items-center space-x-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Expo Sandbox Participants</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Search and screen participants to propose instant swap connections. Hover on components for premium effects.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Search query input */}
                    <div className="col-span-1 md:col-span-6 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                      <input
                        id="search-mesh"
                        type="text"
                        placeholder="Search by name, engineering title, company or biography..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-cyan-500/50 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Filter Offers selection */}
                    <div className="col-span-1 md:col-span-3">
                      <select
                        id="filter-offers"
                        value={filterOffer}
                        onChange={(e) => setFilterOffer(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500/50 rounded-xl py-3 px-3 text-sm font-medium text-gray-300 focus:outline-none transition-all duration-300"
                      >
                        <option value="">Offers Skill: All</option>
                        {SKILL_ECOSYSTEM.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Wants selection */}
                    <div className="col-span-1 md:col-span-3">
                      <select
                        id="filter-wants"
                        value={filterWant}
                        onChange={(e) => setFilterWant(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500/50 rounded-xl py-3 px-3 text-sm font-medium text-gray-300 focus:outline-none transition-all duration-300"
                      >
                        <option value="">Wants Skill: All</option>
                        {SKILL_ECOSYSTEM.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Reset Filters Pill */}
                  {(searchQuery || filterOffer || filterWant) && (
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-gray-400">
                        Showing <span className="text-cyan-400 font-bold">{filteredUsers.length}</span> matching developer capsules.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterOffer('');
                          setFilterWant('');
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 cursor-pointer"
                      >
                        Reset active filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Cards Grid */}
                {filteredUsers.length === 0 ? (
                  <div className="glass-panel text-center py-16 px-4 rounded-3xl border border-white/5 space-y-4">
                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white">No Developers Found</h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                      Adjust your active query or filters. Ensure the searched skill is in the platform's predefined technical blueprint list.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterOffer('');
                        setFilterWant('');
                      }}
                      className="px-4 py-2 bg-[#131522] hover:bg-[#1b1d2e] border border-white/10 rounded-xl text-xs text-white transition-all duration-300"
                    >
                      Clear search queries
                    </button>
                  </div>
                ) : (
                  <div id="grid-explore-items" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => {
                      // Determine if a perfect double-handshake exists
                      const shareOfferWithCurWant = user.offers.some(o => 
                        currentUser?.wants.some(w => w.toLowerCase() === o.toLowerCase())
                      );
                      const shareWantWithCurOffer = user.wants.some(w => 
                        currentUser?.offers.some(o => o.toLowerCase() === w.toLowerCase())
                      );
                      const isPerfectPairValue = shareOfferWithCurWant && shareWantWithCurOffer;

                      // Check if swap proposal already recorded
                      const activePairSwap = swaps.find(s => 
                        (s.senderId === currentUser?.id && s.receiverId === user.id) ||
                        (s.senderId === user.id && s.receiverId === currentUser?.id)
                      );

                      return (
                        <div 
                          key={user.id}
                          className="glass-card-interactive p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group/card"
                        >
                          {/* Radial Glowing Core for Highlighted perfect matches */}
                          {isPerfectPairValue && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover/card:bg-purple-500/20 transition-all duration-500" />
                          )}

                          {/* Top Card Level */}
                          <div className="space-y-4">
                            
                            {/* User Header Info */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-[#131522] border border-white/10 rounded-full px-1 text-[8px] font-mono flex items-center space-x-0.5 text-yellow-400">
                                    <Star className="w-2 h-2 fill-yellow-400" />
                                    <span>{user.rating}</span>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-sm tracking-wide text-white flex items-center space-x-1.5">
                                    <span>{user.name}</span>
                                    {isPerfectPairValue && (
                                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" title="Direct mutual match matchable" />
                                    )}
                                  </h3>
                                  <p className="text-[11px] font-mono text-cyan-400">{user.title}</p>
                                  <p className="text-[10px] text-gray-500">{user.company}</p>
                                </div>
                              </div>

                              {/* Perfect connection match badge */}
                              {isPerfectPairValue && (
                                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-[9px] text-[#e0a7ff] font-bold font-mono px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                                  Perfect Match
                                </div>
                              )}
                            </div>

                            {/* Bio */}
                            <p className="text-xs text-gray-400 leading-relaxed text-left line-clamp-3 italic">
                              "{user.bio}"
                            </p>

                            {/* Section Skills Offer */}
                            <div className="space-y-1.5 text-left">
                              <span className="block text-[10px] font-mono tracking-widest text-purple-400 uppercase">Offers mastery:</span>
                              <div className="flex flex-wrap gap-1">
                                {user.offers.map(s => {
                                  const matchesMyWant = currentUser?.wants.some(w => w.toLowerCase() === s.toLowerCase());
                                  return (
                                    <span 
                                      key={s} 
                                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
                                        matchesMyWant 
                                          ? 'bg-purple-950/40 border-purple-400 text-purple-200 font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
                                          : 'bg-white/5 border-white/5 text-gray-400'
                                      }`}
                                    >
                                      {s}
                                      {matchesMyWant && ' ★'}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Section Skills Wants */}
                            <div className="space-y-1.5 text-left">
                              <span className="block text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Seeks connection for:</span>
                              <div className="flex flex-wrap gap-1">
                                {user.wants.map(s => {
                                  const matchesMyOffer = currentUser?.offers.some(o => o.toLowerCase() === s.toLowerCase());
                                  return (
                                    <span 
                                      key={s} 
                                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
                                        matchesMyOffer 
                                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                                          : 'bg-white/5 border-white/5 text-gray-400'
                                      }`}
                                    >
                                      {s}
                                      {matchesMyOffer && ' ✓'}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                          </div>

                          {/* CTA button inside capsule */}
                          <div className="pt-6">
                            {activePairSwap ? (
                              <div className="flex items-center justify-between w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs">
                                <div className="flex items-center space-x-1 text-gray-400 font-mono text-[10px]">
                                  <span>STATUS:</span>
                                  <span className={`font-bold ${
                                    activePairSwap.status === 'accepted' 
                                      ? 'text-emerald-400' 
                                      : activePairSwap.status === 'declined' 
                                      ? 'text-red-400' 
                                      : 'text-amber-400'
                                  } uppercase`}>
                                    {activePairSwap.status}
                                  </span>
                                </div>

                                {activePairSwap.status === 'accepted' ? (
                                  <button
                                    onClick={() => {
                                      setActiveTab('matches');
                                      triggerNotification("Check credentials section to email this participant!", "success");
                                    }}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded text-[10px] uppercase font-bold transition-all duration-300"
                                  >
                                    View contact
                                  </button>
                                ) : activePairSwap.status === 'pending' && activePairSwap.senderId !== currentUser?.id ? (
                                  <button
                                    onClick={() => handleUpdateSwapStatus(activePairSwap.id, 'accepted', user.name)}
                                    className="bg-purple-500 hover:bg-purple-400 text-white px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all duration-300"
                                  >
                                    Accept Swap!
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-500 italic">Awaiting response</span>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleProposeSwap(user.id, user.name)}
                                disabled={proposingId === user.id}
                                className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide border cursor-pointer transition-all duration-300 flex items-center justify-center space-x-1.5 focus:outline-none ${
                                  isPerfectPairValue 
                                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-transparent text-white hover:opacity-90 shadow-[0_4px_15px_rgba(168,85,247,0.25)]' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/25'
                                }`}
                              >
                                {proposingId === user.id ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                                    <span>Transmitting packet...</span>
                                  </>
                                ) : (
                                  <>
                                    <Zap className={`w-3.5 h-3.5 ${isPerfectPairValue ? 'text-amber-300 animate-pulse' : 'text-purple-400'}`} />
                                    <span>{isPerfectPairValue ? "Perfect Swap Instant Offer" : "Propose Swap Link"}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* PAGE 3: USER DASHBOARD & LIVE PAIRINGS GLOW PANEL */}
            {activeTab === 'dashboard' && currentUser && (
              <div id="view-dashboard" className="space-y-8 animate-fadeIn">
                
                {/* Dashboard Title banner */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="text-left space-y-1">
                    <div className="text-xs font-mono font-bold text-cyan-400 flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>EXPO NODE ONLINE</span>
                    </div>
                    <h2 className="font-display font-black text-3xl tracking-tight text-white">
                      Tech Expo Profile & Pairing Console
                    </h2>
                  </div>
                  <div className="bg-purple-950/30 border border-purple-500/20 px-4 py-2 rounded-2xl flex items-center space-x-3 text-left">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <div>
                      <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Pairing scan state:</span>
                      <span className="text-xs font-semibold text-cyan-400 uppercase">Automatic live synchronizer</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Profile Manager & Editor */}
                  <div className="col-span-1 lg:col-span-7 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 text-left">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-purple-400" />
                        <h3 className="font-display font-bold text-lg text-white">Digital Capsule Editor</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">FullName</label>
                          <input
                            id="field-name"
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                            className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Engineering Title</label>
                          <input
                            id="field-title"
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            required
                            className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Avatar URL</label>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={currentUser.avatar} 
                              alt="preview" 
                              className="w-10 h-10 rounded-xl border border-white/10 object-cover"
                            />
                            <input
                              type="text"
                              disabled
                              value="Default expo session profile avatar"
                              className="w-full bg-[#131522]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-400 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Exhibitor Company</label>
                          <input
                            id="field-company"
                            type="text"
                            value={formCompany}
                            onChange={(e) => setFormCompany(e.target.value)}
                            required
                            className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Mini biography (Expo presentation summary)</label>
                        <textarea
                          id="field-bio"
                          value={formBio}
                          onChange={(e) => setFormBio(e.target.value)}
                          required
                          rows={3}
                          className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                        />
                      </div>

                      {/* Manage Offers tags */}
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                          My Offers Mastery Skill tags:
                        </label>
                        <div className="flex flex-wrap gap-1.5 p-3 bg-black/20 rounded-xl border border-white/5 min-h-[44px]">
                          {formOffers.length === 0 ? (
                            <span className="text-xs text-gray-500 italic">No offers set yet. Select tags below.</span>
                          ) : (
                            formOffers.map(tag => (
                              <span 
                                key={tag} 
                                className="bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs px-2.5 py-1 rounded-full flex items-center space-x-1"
                              >
                                <span>{tag}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveOfferSkill(tag)}
                                  className="hover:text-red-400 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        {/* Selector items */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400">Predefined ecosystem tags (Tap to include):</p>
                          <div className="flex flex-wrap gap-1">
                            {SKILL_ECOSYSTEM.filter(s => !formOffers.includes(s)).map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleAddOfferSkill(s)}
                                className="bg-[#131522] hover:bg-purple-950/20 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 text-[10px] px-2 py-1 rounded transition-all duration-300 cursor-pointer"
                              >
                                + {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Manage Wants tags */}
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                          My Required / Sought Skill tags:
                        </label>
                        <div className="flex flex-wrap gap-1.5 p-3 bg-black/20 rounded-xl border border-white/5 min-h-[44px]">
                          {formWants.length === 0 ? (
                            <span className="text-xs text-gray-500 italic">No wants set yet. Select tags below.</span>
                          ) : (
                            formWants.map(tag => (
                              <span 
                                key={tag} 
                                className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs px-2.5 py-1 rounded-full flex items-center space-x-1"
                              >
                                <span>{tag}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveWantSkill(tag)}
                                  className="hover:text-red-400 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        {/* Selector items */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400">Developer blueprint needs (Tap to include):</p>
                          <div className="flex flex-wrap gap-1">
                            {SKILL_ECOSYSTEM.filter(s => !formWants.includes(s)).map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleAddWantSkill(s)}
                                className="bg-[#131522] hover:bg-cyan-950/20 border border-white/5 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 text-[10px] px-2 py-1 rounded transition-all duration-300 cursor-pointer"
                              >
                                + {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="border-t border-white/5 pt-4 flex items-center justify-end">
                        <button
                          id="btn-update-profile"
                          type="submit"
                          disabled={updatingProfile}
                          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-white transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                        >
                          {updatingProfile ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-white" />
                              <span>Running calculation sync...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Synchronize Capsule & Run Matching Scan</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* Right Column: Live Matches glows panel & interactive web terminal simulation */}
                  <div className="col-span-1 lg:col-span-5 space-y-6 text-left">
                    
                    {/* Live Matches Panel */}
                    <div className="glass-panel-glow p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between space-y-4 relative overflow-hidden glow-live-pulse">
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Autonomous Core Scan</span>
                          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5 animate-pulse font-mono font-bold">ONLINE</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-white tracking-wide glow-text-purple">Live Expo Matches</h3>
                        <p className="text-xs text-gray-400">
                          Based on your current masteries and sought skill tags, these participants are direct fits.
                        </p>
                      </div>

                      {matches.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 italic text-xs font-mono">
                          No computed compatibility matches. Adjust your profile skill-offerings/seeks tag vectors above to activate!
                        </div>
                      ) : (
                        <div id="live-matching-glow-items" className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                          {matches.slice(0, 4).map(match => {
                            const isPerfect = match.type === 'perfect';
                            
                            return (
                              <div 
                                key={match.id}
                                className={`p-4 rounded-xl border transition-all duration-300 ${
                                  isPerfect 
                                    ? 'bg-gradient-to-r from-purple-950/20 to-cyan-950/20 border-purple-500/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                                    : 'bg-[#131522] border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <img 
                                      src={match.matchedWith.avatar} 
                                      alt="avatar" 
                                      className={`w-9 h-9 rounded-lg object-cover border ${isPerfect ? 'border-purple-400' : 'border-white/5'}`}
                                    />
                                    <div>
                                      <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                                        <span>{match.matchedWith.name}</span>
                                        {isPerfect && (
                                          <span className="text-[9px] bg-purple-500/20 text-[#dd9eff] px-1.5 py-0.2 rounded font-mono font-bold font-semibold">PERFECT</span>
                                        )}
                                      </h4>
                                      <p className="text-[10px] text-gray-400 line-clamp-1">{match.matchedWith.title}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-xs font-mono font-bold block ${isPerfect ? 'text-cyan-400 glow-text-cyan' : 'text-purple-400'}`}>
                                      {match.score}% Score
                                    </span>
                                    <span className="text-[8px] text-gray-500 font-mono block">Overlap Vector</span>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-[10px]">
                                  <div>
                                    <span className="block text-gray-500 font-mono text-[8px] uppercase">They want from you:</span>
                                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                                      {match.matchedSkillsToGive.slice(0, 2).map(skill => (
                                        <span key={skill} className="bg-purple-950/40 text-purple-300 px-1 py-0.2 rounded border border-purple-500/20">{skill}</span>
                                      ))}
                                      {match.matchedSkillsToGive.length === 0 && <span className="text-gray-600 italic">None</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-gray-500 font-mono text-[8px] uppercase">They offer you:</span>
                                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                                      {match.matchedSkillsToReceive.slice(0, 2).map(skill => (
                                        <span key={skill} className="bg-cyan-950/40 text-cyan-300 px-1 py-0.2 rounded border border-cyan-500/20">{skill}</span>
                                      ))}
                                      {match.matchedSkillsToReceive.length === 0 && <span className="text-gray-600 italic">None</span>}
                                    </div>
                                  </div>
                                </div>

                                {/* Active swapping controls */}
                                <div className="mt-3 flex items-center justify-end">
                                  {isPerfect ? (
                                    <button
                                      type="button"
                                      onClick={() => openTerminalSession(match.matchedWith)}
                                      className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-[10px] px-3 py-1.5 rounded-lg flex items-center space-x-1 uppercase tracking-wide cursor-pointer focus:outline-none"
                                    >
                                      <Terminal className="w-3.5 h-3.5 animate-pulse" />
                                      <span>Launch Swap Session</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleProposeSwap(match.matchedWith.id, match.matchedWith.name)}
                                      className="text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-1"
                                    >
                                      <span>Propose Swap Link</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>

                    {/* Quick System Diagnostics Info Card (Architectural Honesty) */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Info className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-semibold uppercase tracking-wider">Session Node Diagnostics</h4>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg text-[10px] space-y-1 text-gray-400 font-mono">
                        <div>[LOC] Cloud Run Instance Connected</div>
                        <div>[AUT] Simulated Token Alex Rivera OK</div>
                        <div>[NET] Port 3000 WebSocket dispatcher ready</div>
                        <div>[ALG] Overlap index weight multi-matching vector run</div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* PAGE 4: MATCHES & SWAPS HUB */}
            {activeTab === 'matches' && currentUser && (
              <div id="view-matches" className="space-y-8 animate-fadeIn text-left">
                
                {/* Title */}
                <div className="space-y-1">
                  <h2 className="font-display font-black text-3xl tracking-tight text-white flex items-center space-x-2">
                    <HeartHandshake className="w-6 h-6 text-purple-400" />
                    <span>My Transmission Hub</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Review incoming skill requests, direct active connections, and unlock private developer emails & GitHub profiles.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (Incoming Pending & Connections list) */}
                  <div className="col-span-1 lg:col-span-7 space-y-6">
                    
                    {/* Incoming pending list */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span>Incoming Swap Proposals</span>
                        </h3>
                        <span className="bg-purple-950/50 border border-purple-500/30 text-purple-300 font-mono text-xs px-2 py-0.5 rounded-full">
                          {swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser.id).length} Pending
                        </span>
                      </div>

                      {swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser.id).length === 0 ? (
                        <p className="text-sm text-gray-500 italic py-4">No active incoming swap requests. Fill your Seek Skill lists on Dashboard or explore developers to initiate swaps!</p>
                      ) : (
                        <div className="space-y-3">
                          {swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser.id).map(r => (
                            <div key={r.id} className="bg-[#131522] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-center space-x-3">
                                <img src={r.sender.avatar} alt="avatar" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                <div>
                                  <h4 className="text-xs font-bold text-white">{r.sender.name}</h4>
                                  <p className="text-[10px] text-cyan-400 font-mono">{r.sender.title}</p>
                                  <div className="flex gap-1.5 mt-1">
                                    <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">Offers: {r.sender.offers.slice(0, 2).join(', ')}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 self-end md:self-center">
                                <button
                                  onClick={() => handleUpdateSwapStatus(r.id, 'accepted', r.sender.name)}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all duration-300"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateSwapStatus(r.id, 'declined', r.sender.name)}
                                  className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all duration-300"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SECURE DIRECT CHANNELS (Accepted connections) */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                      
                      <div className="border-b border-white/5 pb-3">
                        <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Direct Secure Channels unlocked</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">These participants accepted your swap invitation. Secure communication channels successfully parsed.</p>
                      </div>

                      {swaps.filter(s => s.status === 'accepted').length === 0 ? (
                        <p className="text-sm text-gray-500 italic py-8 text-center bg-black/10 border border-dashed border-white/5 rounded-2xl">
                          No direct connection channels unsealed yet. Establish pairs or accept swap requests to unlock profiles!
                        </p>
                      ) : (
                        <div id="unlocked-connections-list" className="space-y-4">
                          {swaps.filter(s => s.status === 'accepted').map(r => {
                            // Find which user is the other user
                            const targetUser = r.senderId === currentUser.id ? r.receiver : r.sender;
                            
                            return (
                              <div key={r.id} className="bg-gradient-to-r from-emerald-950/10 via-[#131522] to-[#131522] border border-emerald-500/20 p-5 rounded-2xl space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <div className="flex items-center space-x-3">
                                    <img src={targetUser.avatar} alt="avatar" className="w-11 h-11 rounded-xl object-cover border border-emerald-400/30" />
                                    <div>
                                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                                        <span>{targetUser.name}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                      </h4>
                                      <p className="text-xs text-cyan-400 font-mono">{targetUser.title}</p>
                                      <p className="text-[10px] text-gray-500">{targetUser.company}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => openTerminalSession(targetUser)}
                                      className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/40 text-[10px] text-[#dda5ff] hover:text-white font-bold font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all duration-300"
                                    >
                                      <Terminal className="w-3.5 h-3.5" />
                                      <span>Launch Chat console</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Uncoded Secret Records released */}
                                <div className="bg-black/40 border border-emerald-500/10 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
                                  <div className="flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-all duration-300">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{targetUser.email}</span>
                                  </div>
                                  {targetUser.github && (
                                    <div className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-200 transition-all duration-300">
                                      <Github className="w-3.5 h-3.5" />
                                      <span className="truncate">{targetUser.github}</span>
                                    </div>
                                  )}
                                  {targetUser.linkedin && (
                                    <div className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-all duration-300">
                                      <Linkedin className="w-3.5 h-3.5" />
                                      <span className="truncate">{targetUser.linkedin}</span>
                                    </div>
                                  )}
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Right Column (My Sent Proposals, Status checking) */}
                  <div className="col-span-1 lg:col-span-5 space-y-6">
                    
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                      <div className="border-b border-white/5 pb-3">
                        <h3 className="font-display font-bold text-base text-white">Proposals Transmitted</h3>
                        <p className="text-xs text-gray-400 mt-1">Swap packages you sent out to expo developers.</p>
                      </div>

                      {swaps.filter(s => s.senderId === currentUser.id).length === 0 ? (
                        <p className="text-xs text-gray-500 italic py-4">No sent proposals. Browse candidates inside the Explore board!</p>
                      ) : (
                        <div className="space-y-3">
                          {swaps.filter(s => s.senderId === currentUser.id).map(r => (
                            <div key={r.id} className="bg-black/20 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img src={r.receiver?.avatar} alt="avatar" className="w-8 h-8 rounded-lg object-cover border border-white/5" />
                                <div className="text-left">
                                  <h4 className="text-xs font-bold text-white">{r.receiver?.name}</h4>
                                  <p className="text-[9px] text-gray-400 font-mono leading-none mt-0.5">{r.receiver?.title}</p>
                                </div>
                              </div>

                              <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                                r.status === 'accepted' 
                                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' 
                                  : r.status === 'pending' 
                                  ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20' 
                                  : 'bg-red-950/50 text-red-400 border border-red-500/20'
                              }`}>
                                {r.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}

          </>
        )}

      </main>

      {/* SWAPPING CHAT TERMINAL OVERLAY MODAL */}
      {activeSwappingTerminal && (
        <div id="swapping-chat-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-2xl rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col h-[520px]">
            
            {/* Terminal Header */}
            <div className="bg-slate-950 border-b border-purple-500/25 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-gray-200">
                  SECURE CHAT NODE // {activeSwappingTerminal.name.toUpperCase()}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <button
                onClick={() => setActiveSwappingTerminal(null)}
                className="text-gray-400 hover:text-white cursor-pointer hover:bg-white/5 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Outputs */}
            <div className="flex-grow p-4 bg-black/90 font-mono text-xs text-left text-gray-300 space-y-2 overflow-y-auto select-text">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log.startsWith('[SYS]') && <span className="text-purple-400">{log}</span>}
                  {log.startsWith('[USER]') && <span className="text-cyan-400">{log}</span>}
                  {log.startsWith('[REPLY]') && <span className="text-yellow-400">{log}</span>}
                  {!log.startsWith('[SYS]') && !log.startsWith('[USER]') && !log.startsWith('[REPLY]') && log}
                </div>
              ))}
            </div>

            {/* Terminal Input Box */}
            <form onSubmit={sendTerminalMessage} className="bg-slate-950 p-3 border-t border-purple-500/25 flex items-center space-x-2">
              <span className="font-mono text-xs text-cyan-400 pl-1">alex_rivera@swapio:~$</span>
              <input
                id="terminal-input"
                type="text"
                placeholder="Type a direct secure routing package message here..."
                value={terminalText}
                onChange={(e) => setTerminalText(e.target.value)}
                required
                className="flex-grow bg-transparent font-mono text-xs text-cyan-300 placeholder-gray-600 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs px-3 py-1 rounded cursor-pointer transition-all duration-300"
              >
                EXECUTE
              </button>
            </form>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#030014] py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div>
            <p>© 2026 SWAPIO // Tech Expo. All connections cryptographically verified.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">|</span>
            <span className="text-purple-400 glow-text-purple">BUILT FOR EXPO COMPETITION</span>
            <span className="text-gray-600">|</span>
            <span className="text-cyan-400">STATUS: NODE ONLINE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
