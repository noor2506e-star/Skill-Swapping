import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Users, Star, Zap, RefreshCw, StarHalf } from 'lucide-react';
import { User as UserType } from '../types';

interface ExploreViewProps {
  filteredUsers: UserType[];
  currentUser: UserType | null;
  swaps: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOffer: string;
  setFilterOffer: (offer: string) => void;
  filterWant: string;
  setFilterWant: (want: string) => void;
  SKILL_ECOSYSTEM: string[];
  proposingId: string | null;
  handleProposeSwap: (receiverId: string, receiverName: string) => void;
  handleUpdateSwapStatus: (swapId: string, status: 'accepted' | 'declined', senderName: string) => void;
  setActiveTab: (tab: 'home' | 'explore' | 'dashboard' | 'matches') => void;
  triggerNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function ExploreView({
  filteredUsers,
  currentUser,
  swaps,
  searchQuery,
  setSearchQuery,
  filterOffer,
  setFilterOffer,
  filterWant,
  setFilterWant,
  SKILL_ECOSYSTEM,
  proposingId,
  handleProposeSwap,
  handleUpdateSwapStatus,
  setActiveTab,
  triggerNotification,
}: ExploreViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left"
    >
      {/* Explore Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-purple-400">
          <Users className="w-6 h-6" />
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">
            Expo Sandbox Participants
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Browse profiles, apply dynamic tags, and transmit skill swap offers to initiate interactive terminal sessions.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search text input */}
          <div className="col-span-1 md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              id="search-mesh"
              type="text"
              placeholder="Search by dev name, engineering title, company or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131522]/50 hover:bg-[#131522]/80 focus:bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Filter offers selection */}
          <div className="col-span-1 md:col-span-3">
            <select
              id="filter-offers"
              value={filterOffer}
              onChange={(e) => setFilterOffer(e.target.value)}
              className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl py-3 px-3.5 text-sm font-medium text-gray-300 focus:outline-none transition-all duration-300 cursor-pointer"
            >
              <option value="">Offers Mastery: All</option>
              {SKILL_ECOSYSTEM.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Filter wants selection */}
          <div className="col-span-1 md:col-span-3">
            <select
              id="filter-wants"
              value={filterWant}
              onChange={(e) => setFilterWant(e.target.value)}
              className="w-full bg-[#131522] border border-white/10 focus:border-cyan-500/40 rounded-xl py-3 px-3.5 text-sm font-medium text-gray-300 focus:outline-none transition-all duration-300 cursor-pointer"
            >
              <option value="">Sought Skill: All</option>
              {SKILL_ECOSYSTEM.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filters Summary / Reset Pill */}
        {(searchQuery || filterOffer || filterWant) && (
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <p className="text-xs text-gray-400 font-mono">
              Filtered matches: <span className="text-cyan-400 font-bold">{filteredUsers.length}</span> developer capsules.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterOffer('');
                setFilterWant('');
              }}
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 cursor-pointer font-semibold transition-all duration-300"
            >
              Reset active filters
            </button>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      <AnimatePresence mode="popLayout">
        {filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel text-center py-16 px-4 rounded-3xl border border-white/5 space-y-4"
          >
            <div className="w-14 h-14 bg-purple-950/20 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Developers Found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
              Adjust your active query filter. Ensure the desired skill keyword belongs to the predefined Tech Expo technical blueprint list.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterOffer('');
                setFilterWant('');
              }}
              className="px-5 py-2.5 bg-[#131522] hover:bg-[#1b1d2e] border border-white/10 hover:border-purple-500/30 rounded-xl text-xs font-semibold text-white transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout="position"
            id="grid-explore-items" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredUsers.map((user) => {
              // Perfect Double Handshake overlapping metrics
              const shareOfferWithCurWant = user.offers.some(o => 
                currentUser?.wants.some(w => w.toLowerCase() === o.toLowerCase())
              );
              const shareWantWithCurOffer = user.wants.some(w => 
                currentUser?.offers.some(o => o.toLowerCase() === w.toLowerCase())
              );
              const isPerfectPairValue = shareOfferWithCurWant && shareWantWithCurOffer;

              // Check if swap recorded
              const activePairSwap = swaps.find(s => 
                (s.senderId === currentUser?.id && s.receiverId === user.id) ||
                (s.senderId === user.id && s.receiverId === currentUser?.id)
              );

              return (
                <motion.div 
                  layout
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card-interactive p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group/card text-left"
                >
                  {/* Subtle Glowing Pulse behind perfect matches */}
                  {isPerfectPairValue && (
                    <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover/card:bg-purple-500/15 transition-all duration-500" />
                  )}

                  <div className="space-y-5">
                    {/* User Profile Capsule Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="relative shrink-0">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-[#131522] border border-white/10 rounded-full px-1.5 py-0.5 text-[8px] font-mono flex items-center space-x-0.5 text-yellow-400">
                            <Star className="w-2 h-2 fill-yellow-400" />
                            <span className="font-bold">{user.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-sm tracking-wide text-white flex items-center space-x-1.5">
                            <span>{user.name}</span>
                            {isPerfectPairValue && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="Direct mutual overlap verified" />
                            )}
                          </h3>
                          <p className="text-[11px] font-mono text-cyan-400 leading-none mt-1">{user.title}</p>
                          <p className="text-[10px] text-gray-500 leading-none mt-1">{user.company}</p>
                        </div>
                      </div>

                      {/* Overlap Perfect Match Badge */}
                      {isPerfectPairValue && (
                        <span className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-[9px] text-purple-300 font-bold font-mono px-2.5 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                          Perfect Match
                        </span>
                      )}
                    </div>

                    {/* Developer Bio summary */}
                    <p className="text-xs text-gray-400 leading-relaxed text-left line-clamp-3 italic bg-black/10 p-2.5 rounded-lg border border-white/5">
                      "{user.bio}"
                    </p>

                    {/* Skill offerings list */}
                    <div className="space-y-1.5 text-left">
                      <span className="block text-[9px] font-mono tracking-widest text-purple-400 uppercase font-semibold">Offers mastery:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.offers.map(s => {
                          const matchesMyWant = currentUser?.wants.some(w => w.toLowerCase() === s.toLowerCase());
                          return (
                            <span 
                              key={s} 
                              className={`text-[10px] px-2.5 py-0.5 rounded-md border transition-all duration-300 ${
                                matchesMyWant 
                                  ? 'bg-purple-950/40 border-purple-400 text-purple-200 font-bold shadow-[0_0_8px_rgba(168,85,247,0.25)]' 
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

                    {/* Skill wants list */}
                    <div className="space-y-1.5 text-left">
                      <span className="block text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">Seeks connection for:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.wants.map(s => {
                          const matchesMyOffer = currentUser?.offers.some(o => o.toLowerCase() === s.toLowerCase());
                          return (
                            <span 
                              key={s} 
                              className={`text-[10px] px-2.5 py-0.5 rounded-md border transition-all duration-300 ${
                                matchesMyOffer 
                                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]' 
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

                  {/* Swap CTA Actions */}
                  <div className="pt-6 mt-auto">
                    {activePairSwap ? (
                      <div className="flex items-center justify-between w-full bg-[#0a0b10] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs font-mono">
                        <div className="flex items-center space-x-1 text-gray-400 text-[10px]">
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
                              triggerNotification("Unsealed credentials active! Launch secure chat terminal.", "success");
                            }}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all duration-300 cursor-pointer"
                          >
                            View contact
                          </button>
                        ) : activePairSwap.status === 'pending' && activePairSwap.senderId !== currentUser?.id ? (
                          <button
                            onClick={() => handleUpdateSwapStatus(activePairSwap.id, 'accepted', user.name)}
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white px-3 py-1 rounded text-[10px] uppercase font-bold transition-all duration-300 cursor-pointer"
                          >
                            Accept Swap!
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 italic">Awaiting Response</span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleProposeSwap(user.id, user.name)}
                        disabled={proposingId === user.id}
                        className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider border cursor-pointer transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none ${
                          isPerfectPairValue 
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 border-transparent text-white hover:opacity-90 shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:scale-[1.01]' 
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-purple-500/20'
                        }`}
                      >
                        {proposingId === user.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>TRANSMITTING BINDINGS...</span>
                          </>
                        ) : (
                          <>
                            <Zap className={`w-3.5 h-3.5 ${isPerfectPairValue ? 'text-yellow-300 animate-pulse' : 'text-purple-400'}`} />
                            <span>{isPerfectPairValue ? "PERFECT SWAP INSTANT OFFER" : "PROPOSE SWAP LINK"}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
