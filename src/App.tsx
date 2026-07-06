/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkle, RefreshCw, Cpu } from 'lucide-react';
import { User as UserType, Match as MatchType } from './types';

// Premium Modular Redesigned Sub-components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ExploreView from './components/ExploreView';
import DashboardView from './components/DashboardView';
import MatchesView from './components/MatchesView';
import ChatTerminal from './components/ChatTerminal';

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
  
  // Search / Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOffer, setFilterOffer] = useState('');
  const [filterWant, setFilterWant] = useState('');
  
  // Interaction & UI Loading states
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [proposingId, setProposingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'info'} | null>(null);

  // Profile Form states (synchronized to loaded current user)
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formOffers, setFormOffers] = useState<string[]>([]);
  const [formWants, setFormWants] = useState<string[]>([]);

  // Floating terminal modal for mutual swaps
  const [activeSwappingTerminal, setActiveSwappingTerminal] = useState<UserType | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalText, setTerminalText] = useState('');

  // Toast notification system
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all initial data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, currentRes, matchesRes, swapsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/users/current'),
        fetch('/api/matches'),
        fetch('/api/swaps')
      ]);

      if (usersRes.ok) {
        setUsers(await usersRes.json());
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
        setMatches(await matchesRes.json());
      }

      if (swapsRes.ok) {
        setSwaps(await swapsRes.json());
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

  // Sync matches and swaps when active tab changes to see live computations
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'matches' || activeTab === 'explore') {
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

  // Propose a swap connection workflow
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

  // Add/remove offer tags
  const handleAddOfferSkill = (skill: string) => {
    if (skill && !formOffers.includes(skill)) {
      setFormOffers([...formOffers, skill]);
    }
  };

  const handleRemoveOfferSkill = (skill: string) => {
    setFormOffers(formOffers.filter(s => s !== skill));
  };

  // Add/remove want tags
  const handleAddWantSkill = (skill: string) => {
    if (skill && !formWants.includes(skill)) {
      setFormWants([...formWants, skill]);
    }
  };

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

  // Filters logic
  const filteredUsers = users.filter(user => {
    if (user.isCurrent) return false;
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

  const perfectMatchesCount = matches.filter(m => m.type === 'perfect').length;
  const pendingSwapsCount = swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser?.id).length;

  return (
    <div id="app-container" className="min-h-screen bg-[#030014] bg-cyber-grid text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* PREMIUM GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-purple-950/15 rounded-full blur-[150px] pointer-events-none" />

      {/* SYSTEM TOAST NOTIFICATION */}
      {notification && (
        <div id="toast-notify" className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-panel-glow px-6 py-4 rounded-xl flex items-center space-x-3 border-l-4 border-l-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <p className="text-sm font-semibold tracking-wide text-gray-200">{notification.message}</p>
          </div>
        </div>
      )}

      {/* PREMIUM NAVIGATION HEADER */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        usersCount={users.length}
        perfectMatchesCount={perfectMatchesCount}
        pendingSwapsCount={pendingSwapsCount}
      />

      {/* STAGE CONTAINER */}
      <main id="core-view-stage" className="flex-grow max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase">BOOTING SECURE PARADIGMS...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <LandingPage 
                setActiveTab={setActiveTab}
                usersCount={users.length}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreView 
                filteredUsers={filteredUsers}
                currentUser={currentUser}
                swaps={swaps}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterOffer={filterOffer}
                setFilterOffer={setFilterOffer}
                filterWant={filterWant}
                setFilterWant={setFilterWant}
                SKILL_ECOSYSTEM={SKILL_ECOSYSTEM}
                proposingId={proposingId}
                handleProposeSwap={handleProposeSwap}
                handleUpdateSwapStatus={handleUpdateSwapStatus}
                setActiveTab={setActiveTab}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView 
                currentUser={currentUser}
                updatingProfile={updatingProfile}
                handleUpdateProfile={handleUpdateProfile}
                formName={formName}
                setFormName={setFormName}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formCompany={formCompany}
                setFormCompany={setFormCompany}
                formBio={formBio}
                setFormBio={setFormBio}
                formOffers={formOffers}
                formWants={formWants}
                SKILL_ECOSYSTEM={SKILL_ECOSYSTEM}
                handleAddOfferSkill={handleAddOfferSkill}
                handleRemoveOfferSkill={handleRemoveOfferSkill}
                handleAddWantSkill={handleAddWantSkill}
                handleRemoveWantSkill={handleRemoveWantSkill}
                matches={matches}
                openTerminalSession={openTerminalSession}
                handleProposeSwap={handleProposeSwap}
              />
            )}

            {activeTab === 'matches' && (
              <MatchesView 
                currentUser={currentUser}
                swaps={swaps}
                handleUpdateSwapStatus={handleUpdateSwapStatus}
                openTerminalSession={openTerminalSession}
                triggerNotification={triggerNotification}
              />
            )}
          </>
        )}
      </main>

      {/* CHAT TERMINAL MODAL OVERLAY */}
      <ChatTerminal 
        activeSwappingTerminal={activeSwappingTerminal}
        setActiveSwappingTerminal={setActiveSwappingTerminal}
        terminalLogs={terminalLogs}
        terminalText={terminalText}
        setTerminalText={setTerminalText}
        sendTerminalMessage={sendTerminalMessage}
        currentUser={currentUser}
      />

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#030014]/60 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            <p>© 2026 SWAPIO // Tech Expo. Cryptographic matches computed locally.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-400/80 glow-text-purple">BUILT FOR EXPO COMPETITION</span>
            <span className="text-gray-700">|</span>
            <span className="text-cyan-400/80">STATUS: INTERFACE ACTIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
