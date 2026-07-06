import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  MessageSquare, 
  Check, 
  X, 
  CheckCircle2, 
  Terminal, 
  Mail, 
  Github, 
  Linkedin 
} from 'lucide-react';
import { User as UserType } from '../types';

interface MatchesViewProps {
  currentUser: UserType | null;
  swaps: any[];
  handleUpdateSwapStatus: (swapId: string, status: 'accepted' | 'declined', senderName: string) => void;
  openTerminalSession: (user: UserType) => void;
  triggerNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function MatchesView({
  currentUser,
  swaps,
  handleUpdateSwapStatus,
  openTerminalSession,
  triggerNotification,
}: MatchesViewProps) {
  if (!currentUser) return null;

  const incomingPending = swaps.filter(s => s.status === 'pending' && s.receiverId === currentUser.id);
  const acceptedChannels = swaps.filter(s => s.status === 'accepted');
  const transmittedProposals = swaps.filter(s => s.senderId === currentUser.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left"
    >
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-purple-400">
          <HeartHandshake className="w-6 h-6" />
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">
            Transmission Hub
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Review incoming swap proposals, monitor sent packets, and access cryptographically unsealed contact records for accepted pairings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Proposals & Established Channels */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          
          {/* Incoming Swap Proposals */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                <MessageSquare className="w-4.5 h-4.5 text-purple-400" />
                <span>Incoming Swap Proposals</span>
              </h3>
              <span className="bg-purple-950/40 border border-purple-500/20 text-purple-300 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                {incomingPending.length} Pending
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {incomingPending.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 italic py-4 font-mono"
                >
                  No active incoming swap proposals. Fill your Seek Skill lists on Dashboard or explore developer capsules to initiate!
                </motion.p>
              ) : (
                <div className="space-y-3">
                  {incomingPending.map(r => (
                    <motion.div 
                      layout
                      key={r.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#131522]/70 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-500/10 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <img 
                          src={r.sender.avatar} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">{r.sender.name}</h4>
                          <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{r.sender.title}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            <span className="text-[8px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/10">Offers: {r.sender.offers.slice(0, 3).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button
                          onClick={() => handleUpdateSwapStatus(r.id, 'accepted', r.sender.name)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center space-x-1 cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUpdateSwapStatus(r.id, 'declined', r.sender.name)}
                          className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center space-x-1 cursor-pointer transition-all duration-300"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

          </div>

          {/* SECURE DIRECT CHANNELS (Accepted connections) */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                <span>Direct Secure Channels Unsealed</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                These participants approved your pairing handshake. Private exposure metrics parsed successfully.
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {acceptedChannels.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center bg-black/10 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center space-y-2"
                >
                  <p className="text-xs text-gray-500 italic font-mono">No direct secure connection channels unsealed yet.</p>
                  <p className="text-[10px] text-gray-600 max-w-xs font-mono leading-relaxed">Establish complementaries on the Explore board or accept pending requests to release encrypted contact records!</p>
                </motion.div>
              ) : (
                <div id="unlocked-connections-list" className="space-y-4">
                  {acceptedChannels.map(r => {
                    const targetUser = r.senderId === currentUser.id ? r.receiver : r.sender;
                    
                    return (
                      <motion.div 
                        layout
                        key={r.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-gradient-to-r from-emerald-950/5 via-[#131522]/80 to-[#131522]/80 border border-emerald-500/20 p-5 rounded-xl space-y-4 shadow-[0_4px_12px_rgba(16,185,129,0.03)]"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                          <div className="flex items-center space-x-3.5">
                            <img 
                              src={targetUser.avatar} 
                              alt="avatar" 
                              className="w-11 h-11 rounded-lg object-cover border border-emerald-500/20 shrink-0" 
                            />
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                                <span>{targetUser.name}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              </h4>
                              <p className="text-xs text-cyan-400 font-mono mt-0.5 leading-none">{targetUser.title}</p>
                              <p className="text-[10px] text-gray-500 mt-1 leading-none">{targetUser.company}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => openTerminalSession(targetUser)}
                            className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/30 text-[10px] text-[#dda5ff] hover:text-white font-bold font-mono px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-all duration-300 cursor-pointer shadow-[0_2px_8px_rgba(168,85,247,0.1)] self-end sm:self-center"
                          >
                            <Terminal className="w-3.5 h-3.5 animate-pulse" />
                            <span>LAUNCH CHAT TERMINAL</span>
                          </button>
                        </div>

                        {/* Uncoded Social Records decrypted */}
                        <div className="bg-black/40 border border-emerald-500/10 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                          <div className="flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-all duration-300">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            <span className="truncate select-all">{targetUser.email}</span>
                          </div>
                          {targetUser.github && (
                            <div className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-200 transition-all duration-300">
                              <Github className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                              <span className="truncate select-all">{targetUser.github}</span>
                            </div>
                          )}
                          {targetUser.linkedin && (
                            <div className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-all duration-300">
                              <Linkedin className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                              <span className="truncate select-all">{targetUser.linkedin}</span>
                            </div>
                          )}
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Right Column: Sent Transmissions */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-base text-white">Proposals Transmitted</h3>
              <p className="text-xs text-gray-400 mt-1">
                Outbound swap packets sent to tech expo attendees.
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {transmittedProposals.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 italic py-4 font-mono text-left"
                >
                  No sent transmissions. Browse candidates on the Explore board to initiate!
                </motion.p>
              ) : (
                <div className="space-y-3">
                  {transmittedProposals.map(r => (
                    <motion.div 
                      layout
                      key={r.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="bg-black/25 border border-white/5 p-3.5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <img 
                          src={r.receiver?.avatar} 
                          alt="avatar" 
                          className="w-8 h-8 rounded-lg object-cover border border-white/5 shrink-0" 
                        />
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-white">{r.receiver?.name}</h4>
                          <p className="text-[9px] text-gray-400 font-mono leading-none mt-1">{r.receiver?.title}</p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        r.status === 'accepted' 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                          : r.status === 'pending' 
                          ? 'bg-amber-950/40 text-amber-400 border-amber-500/20' 
                          : 'bg-red-950/40 text-red-400 border-red-500/20'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
