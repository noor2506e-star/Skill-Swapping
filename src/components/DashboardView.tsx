import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Cpu, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Terminal, 
  ArrowRight, 
  Info,
  Award,
  Sparkles
} from 'lucide-react';
import { User as UserType, Match as MatchType } from '../types';

interface DashboardViewProps {
  currentUser: UserType | null;
  updatingProfile: boolean;
  handleUpdateProfile: (e: React.FormEvent) => void;
  formName: string;
  setFormName: (name: string) => void;
  formTitle: string;
  setFormTitle: (title: string) => void;
  formCompany: string;
  setFormCompany: (company: string) => void;
  formBio: string;
  setFormBio: (bio: string) => void;
  formOffers: string[];
  formWants: string[];
  SKILL_ECOSYSTEM: string[];
  handleAddOfferSkill: (skill: string) => void;
  handleRemoveOfferSkill: (skill: string) => void;
  handleAddWantSkill: (skill: string) => void;
  handleRemoveWantSkill: (skill: string) => void;
  matches: MatchType[];
  openTerminalSession: (user: UserType) => void;
  handleProposeSwap: (receiverId: string, receiverName: string) => void;
}

export default function DashboardView({
  currentUser,
  updatingProfile,
  handleUpdateProfile,
  formName,
  setFormName,
  formTitle,
  setFormTitle,
  formCompany,
  setFormCompany,
  formBio,
  setFormBio,
  formOffers,
  formWants,
  SKILL_ECOSYSTEM,
  handleAddOfferSkill,
  handleRemoveOfferSkill,
  handleAddWantSkill,
  handleRemoveWantSkill,
  matches,
  openTerminalSession,
  handleProposeSwap,
}: DashboardViewProps) {
  if (!currentUser) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left"
    >
      {/* Profile Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-cyan-400 flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>EXPO COMPILER ONLINE</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">
            Tech Expo Profile & Pairing Console
          </h2>
        </div>
        <div className="bg-purple-950/25 border border-purple-500/20 px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="text-left font-mono text-xs">
            <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-semibold">PAIRING SCAN:</span>
            <span className="text-cyan-400 font-bold uppercase">AUTONOMOUS DISPATCH</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Digital Capsule Settings */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <form onSubmit={handleUpdateProfile} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-bold text-base text-white">Digital Capsule Editor</h3>
            </div>

            {/* Name / Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                <input
                  id="field-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full bg-[#131522]/60 hover:bg-[#131522]/90 focus:bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Engineering Title</label>
                <input
                  id="field-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full bg-[#131522]/60 hover:bg-[#131522]/90 focus:bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Avatar / Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Avatar Session</label>
                <div className="flex items-center space-x-3 bg-[#0a0b10]/40 p-1.5 rounded-xl border border-white/5">
                  <img 
                    src={currentUser.avatar} 
                    alt="avatar" 
                    className="w-9 h-9 rounded-lg border border-white/10 object-cover"
                  />
                  <span className="text-[11px] font-mono text-gray-500">Live Session Mock Node ID</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Exhibitor Organization</label>
                <input
                  id="field-company"
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  required
                  className="w-full bg-[#131522]/60 hover:bg-[#131522]/90 focus:bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Mini biography (Expo presentation summary)</label>
              <textarea
                id="field-bio"
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                required
                rows={3}
                className="w-full bg-[#131522]/60 hover:bg-[#131522]/90 focus:bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Manage Offers Skills tags */}
            <div className="space-y-3.5 pt-2 border-t border-white/5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Skills I Offer (My Masteries)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 bg-purple-950/5 rounded-xl border border-purple-500/10 min-h-[46px]">
                {formOffers.length === 0 ? (
                  <span className="text-xs text-gray-500 italic font-mono">No active offers. Select tags below.</span>
                ) : (
                  formOffers.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs px-2.5 py-1 rounded-md flex items-center space-x-1 font-semibold"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOfferSkill(tag)}
                        className="hover:text-red-400 cursor-pointer font-bold focus:outline-none ml-1 text-purple-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-400 font-mono">Tap tags to include in your offered stack:</p>
                <div className="flex flex-wrap gap-1">
                  {SKILL_ECOSYSTEM.filter(s => !formOffers.includes(s)).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddOfferSkill(s)}
                      className="bg-[#131522]/70 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 text-[10px] px-2 py-1 rounded transition-all duration-300 cursor-pointer"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Manage Wants Skills tags */}
            <div className="space-y-3.5 pt-4 border-t border-white/5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Skills I Want (My Sought Technologies)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 bg-cyan-950/5 rounded-xl border border-cyan-500/10 min-h-[46px]">
                {formWants.length === 0 ? (
                  <span className="text-xs text-gray-500 italic font-mono">No active seeks. Select tags below.</span>
                ) : (
                  formWants.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs px-2.5 py-1 rounded-md flex items-center space-x-1 font-semibold"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveWantSkill(tag)}
                        className="hover:text-red-400 cursor-pointer font-bold focus:outline-none ml-1 text-cyan-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-400 font-mono">Tap tags to include in your required stack:</p>
                <div className="flex flex-wrap gap-1">
                  {SKILL_ECOSYSTEM.filter(s => !formWants.includes(s)).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddWantSkill(s)}
                      className="bg-[#131522]/70 hover:bg-cyan-950/30 border border-white/5 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 text-[10px] px-2 py-1 rounded transition-all duration-300 cursor-pointer"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save / Run matching sync button */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-end">
              <button
                id="btn-update-profile"
                type="submit"
                disabled={updatingProfile}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 px-6 py-3 rounded-xl text-xs font-bold tracking-wider text-white transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:scale-[1.01]"
              >
                {updatingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>SYNCHRONIZING VECTORS...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>SYNCHRONIZE PROFILE & SCAN PAIRINGS</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live computed Matches Glow Panel */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          {/* Glowing Live Matches list */}
          <div className="glass-panel-glow p-6 rounded-2xl border border-purple-500/20 flex flex-col space-y-4 relative overflow-hidden glow-live-pulse text-left shadow-[0_8px_30px_rgba(168,85,247,0.1)]">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold">Autonomous Match Core</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5 animate-pulse font-mono font-bold">STABLE</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white tracking-wide glow-text-purple flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Live Expo Matches</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Evaluated by overlapping offered and sought keywords. The matching score reflects full direct complementarity.
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {matches.length === 0 ? (
                <div className="py-12 text-center text-gray-500 italic text-xs font-mono">
                  No overlapping matches computed. Add complementary tags to offered/sought lists above to activate the engine!
                </div>
              ) : (
                <div id="live-matching-glow-items" className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                  {matches.slice(0, 5).map(match => {
                    const isPerfect = match.type === 'perfect';
                    
                    return (
                      <motion.div 
                        layout
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          isPerfect 
                            ? 'bg-gradient-to-r from-purple-950/25 to-cyan-950/20 border-purple-500/30 hover:border-purple-400/50 shadow-[0_4px_15px_rgba(168,85,247,0.08)]' 
                            : 'bg-[#131522]/80 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={match.matchedWith.avatar} 
                              alt="avatar" 
                              className={`w-10 h-10 rounded-lg object-cover border ${isPerfect ? 'border-purple-500/50' : 'border-white/10'}`}
                            />
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                                <span>{match.matchedWith.name}</span>
                                {isPerfect && (
                                  <span className="text-[8px] bg-purple-500/20 text-[#dd9eff] px-1.5 py-0.5 rounded font-mono font-bold">PERFECT</span>
                                )}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-light line-clamp-1 mt-0.5">{match.matchedWith.title}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-mono font-bold block ${isPerfect ? 'text-cyan-400 glow-text-cyan' : 'text-purple-400'}`}>
                              {match.score}% Match
                            </span>
                            <span className="text-[8px] text-gray-500 font-mono block">Compatibility Index</span>
                          </div>
                        </div>

                        {/* Interactive Overlap Details */}
                        <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-white/5 pt-2.5 text-[10px]">
                          <div>
                            <span className="block text-gray-500 font-mono text-[8px] uppercase tracking-wider font-semibold">They want from you:</span>
                            <div className="flex flex-wrap gap-0.5 mt-1">
                              {match.matchedSkillsToGive.slice(0, 3).map(skill => (
                                <span key={skill} className="bg-purple-950/30 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/10">{skill}</span>
                              ))}
                              {match.matchedSkillsToGive.length === 0 && <span className="text-gray-600 italic">None</span>}
                            </div>
                          </div>
                          <div>
                            <span className="block text-gray-500 font-mono text-[8px] uppercase tracking-wider font-semibold">They offer you:</span>
                            <div className="flex flex-wrap gap-0.5 mt-1">
                              {match.matchedSkillsToReceive.slice(0, 3).map(skill => (
                                <span key={skill} className="bg-cyan-950/30 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/10">{skill}</span>
                              ))}
                              {match.matchedSkillsToReceive.length === 0 && <span className="text-gray-600 italic">None</span>}
                            </div>
                          </div>
                        </div>

                        {/* Swap trigger */}
                        <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-3">
                          {isPerfect ? (
                            <button
                              type="button"
                              onClick={() => openTerminalSession(match.matchedWith)}
                              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer shadow-[0_2px_10px_rgba(6,182,212,0.2)]"
                            >
                              <Terminal className="w-3.5 h-3.5 animate-pulse" />
                              <span>Launch Swap terminal</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleProposeSwap(match.matchedWith.id, match.matchedWith.name)}
                              className="text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-1 cursor-pointer font-mono"
                            >
                              <span>Propose Swap Link</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

          </div>

          {/* Quick System Diagnostics Info Card (Architectural Honesty) */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <div className="flex items-center space-x-2 text-gray-300">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Session Node Diagnostics</h4>
            </div>
            <div className="bg-black/40 p-3 rounded-lg text-[10px] space-y-1.5 text-gray-400 font-mono border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-500">Node Location:</span>
                <span>Cloud Run Instance [US]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Authorized Token:</span>
                <span className="text-purple-400 font-semibold">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">WebSocket Dispatcher:</span>
                <span className="text-emerald-400">Port 3000 Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vector Metric:</span>
                <span className="text-cyan-400">Cosine Overlap Matrix</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
