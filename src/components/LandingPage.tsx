import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ArrowRight, 
  User, 
  Sparkles, 
  Zap, 
  Cpu, 
  Award, 
  ShieldCheck, 
  Globe,
  Star,
  RefreshCw,
  Code
} from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: 'home' | 'explore' | 'dashboard' | 'matches') => void;
  usersCount: number;
}

export default function LandingPage({ setActiveTab, usersCount }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Architect Developer Capsule",
      desc: "Declare your unique developer profile inside the sandbox. Specify high-performance frameworks, database solutions, or low-level systems you bring to the expo.",
      detail: "Your capsule indexes real masteries like React, TypeScript, Rust systems, or smart contracts.",
      badge: "INIT_CAPSULE"
    },
    {
      title: "2. Formulate Sought Skill Vectors",
      desc: "Select missing tech stacks or developer blueprints you need assistance with for your active expo competitive project roadmap.",
      detail: "Specify the exact masteries you're seeking, such as Kubernetes clusters, PyTorch models, or AWS automation.",
      badge: "SOUGHT_VECTORS"
    },
    {
      title: "3. Run Autonomous Match Scan",
      desc: "Our optimized matchmaking algorithm parses and scores intersections between all developer profiles in real-time.",
      detail: "Detects overlapping complementaries instantly. Computes overlap scores and glows when a direct perfect swap is available.",
      badge: "VECTOR_MATCH"
    },
    {
      title: "4. Unseal Secure Handshake",
      desc: "Connect instantly inside our secure terminal log. Accepted pairs unseal social records, developer emails, and direct secure messaging.",
      detail: "Encrypts transaction records. Only approved linkages release communication channels to prevent unsolicited spam.",
      badge: "SECURE_SWAP"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-20 py-6"
    >
      {/* 1. HERO SHOWCASE SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 pt-4">
        {/* Dynamic Launchpad Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center space-x-2 bg-[#131522]/80 border border-purple-500/20 px-4 py-1.5 rounded-full text-xs font-mono text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>TECH EXPO 2026 COMPETITIVE LAUNCHPAD</span>
        </motion.div>
        
        {/* Main Header */}
        <motion.h1 
          variants={itemVariants}
          className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-white"
        >
          Unite Engineering Vectors.<br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Swap Skill Masteries.
          </span>
        </motion.h1>

        {/* Hero Paragraph */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light"
        >
          The ultimate decentralized sandbox engineered for tech innovators. Offer your active programming masteries, seek missing modules, and launch instant mutual swap connections.
        </motion.p>

        {/* CTA Actions */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto"
        >
          <button
            id="hero-cta-explore"
            onClick={() => setActiveTab('explore')}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 px-8 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 text-white cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Dev Capsules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-cta-profile"
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto bg-[#131522]/80 hover:bg-[#1b1d2e] border border-white/5 hover:border-purple-500/20 px-8 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 text-gray-200 cursor-pointer"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span>Configure My Profile</span>
          </button>
        </motion.div>
      </section>

      {/* 2. EXPO METRICS / FEATURES BENTO GRID */}
      <motion.section 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
      >
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/10 space-y-4 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Smart Match Pairing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instant backend intersection scanner evaluates complementary profiles. Fulfill mutual criteria with zero manual search latency.
            </p>
          </div>
          <div className="pt-2 text-[10px] font-mono text-purple-400">CORE_ALGO_V2 // ENABLED</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/10 space-y-4 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Frosted Glass Capsules</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Highly responsive glassmorphic interfaces highlighting skill offers and seeks with glowing neon borders and metadata chips.
            </p>
          </div>
          <div className="pt-2 text-[10px] font-mono text-cyan-400">UI_GLASSMORPHISM // RENDERED</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/10 space-y-4 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              <Award className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Verified Peer Trust</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Rest assured that contact channels are locked behind secure double handshakes. Prevent unsolicited spam and co-build with confidence.
            </p>
          </div>
          <div className="pt-2 text-[10px] font-mono text-pink-400">SECURE_CREDENTIAL // LOCK</div>
        </div>
      </motion.section>

      {/* 3. INTERACTIVE HOW IT WORKS STEPPER */}
      <motion.section 
        variants={itemVariants}
        className="border border-white/5 rounded-3xl bg-gradient-to-b from-[#0a0c16]/80 to-[#030014] p-6 lg:p-10 space-y-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">SWAP PROTOCOL BLUEPRINT</span>
          <h2 className="font-display font-bold text-3xl text-white">Interactive Stepper Sandbox</h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Select each step in the pipeline below to visualize how developer connection vectors converge.
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
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
                  activeStep === idx 
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                    : 'bg-[#131522]/40 border-white/5 hover:bg-[#131522]/80 hover:border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                    activeStep === idx ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-gray-400'
                  }`}>
                    0{idx+1}
                  </span>
                  <div className="text-left">
                    <h4 className={`font-semibold text-sm tracking-wide ${
                      activeStep === idx ? 'text-white' : 'text-gray-300'
                    }`}>
                      {step.title}
                    </h4>
                    <span className="text-[9px] font-mono opacity-60 text-purple-400 block mt-0.5">{step.badge}</span>
                  </div>
                </div>
                {activeStep === idx && (
                  <p className="text-xs text-gray-400 leading-relaxed mt-2.5 pl-10.5 animate-fadeIn">
                    {step.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Stepper Simulator Terminal */}
          <div className="col-span-1 lg:col-span-7 bg-[#0a0b10]/90 rounded-2xl p-6 border border-white/5 aspect-[16/10] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]">
            {/* Cyber Grid Overlay */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-cyan-400 font-bold">vector_sandbox_node.sh</span>
              </div>
              <div className="bg-purple-950/40 border border-purple-500/30 text-[9px] font-mono text-purple-300 px-2 py-0.5 rounded">
                SIM_PHASE_0{activeStep + 1}
              </div>
            </div>

            <div className="my-auto py-6 relative z-10 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 w-full max-w-sm"
                  >
                    <div className="bg-[#131522]/80 border border-purple-500/20 p-4 rounded-xl space-y-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                          <span className="text-xs font-mono text-purple-300 font-bold">ALEX_RIVERA.json</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">Capsule OK ✓</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">Senior Full-Stack Engineer presenting reactive systems, WebRTC integrations, and hardware widgets.</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/10 px-2 py-0.5 rounded-full">React</span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/10 px-2 py-0.5 rounded-full">TypeScript</span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/10 px-2 py-0.5 rounded-full">Node.js</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 w-full max-w-sm text-left"
                  >
                    <div className="bg-[#131522]/80 border border-cyan-500/20 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-300">DECLARED_WANTS_VECTORS</span>
                        <span className="text-[9px] text-cyan-500 font-mono">Pending Link...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#0a0b10] border border-white/5 p-2 rounded-lg text-xs text-gray-300 flex items-center justify-between font-mono">
                          <span>Rust Systems</span>
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <div className="bg-[#0a0b10] border border-white/5 p-2 rounded-lg text-xs text-gray-300 flex items-center justify-between font-mono">
                          <span>Solidity Web3</span>
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 text-center"
                  >
                    <div className="flex items-center justify-center space-x-6 relative">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl border border-purple-500 bg-[#131522] flex items-center justify-center font-display font-bold text-xs text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">Alex R.</div>
                        <div className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-bold border border-black uppercase font-mono">GIVE</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                        <span className="text-[10px] font-mono text-cyan-400 font-bold mt-1.5">94% Overlap</span>
                      </div>

                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl border border-cyan-500 bg-[#131522] flex items-center justify-center font-display font-bold text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">Elena R.</div>
                        <div className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-black w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-bold border border-black uppercase font-mono">TAKE</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed font-light">
                      Mutual double-handshake detected! Elena offers <span className="text-cyan-400 font-semibold">Solidity</span> & <span className="text-cyan-400 font-semibold">Rust</span>, wants Alex's <span className="text-purple-400 font-semibold">React</span> expertise.
                    </p>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 w-full max-w-sm text-left"
                  >
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-1.5">
                        <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">UNSEALED SECURE RECORD</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-gray-400">Cryptographic swap accepted. Encryption decrypted. Contacts unsealed:</p>
                      <div className="space-y-1.5 text-xs font-mono text-emerald-300 bg-black/40 p-2.5 rounded border border-emerald-500/10">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">✉</span>
                          <span>elena@ethersphere.dev</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">🔗</span>
                          <span>github.com/elena-eth</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/5 pt-3 relative z-10">
              <p className="text-[11px] font-mono text-gray-500 text-left">
                &gt;&gt; {steps[activeStep].detail}
              </p>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 4. REDIRECT DECK BANNER */}
      <motion.section 
        variants={itemVariants}
        className="rounded-3xl bg-gradient-to-r from-purple-600/10 via-purple-950/10 to-cyan-500/15 border border-purple-500/20 p-8 sm:p-12 relative overflow-hidden"
        id="explore-cta-banner"
      >
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="max-w-xl text-left space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Ready to compute your pairing node?
          </h2>
          <p className="text-sm text-gray-300 font-light leading-relaxed">
            Initialize your active credentials and jump directly onto the active dev grid. Screen candidates, check expo portfolios, and link with engineering partners instantly.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('explore')}
              className="rounded-xl bg-white text-[#030014] font-display text-xs font-bold px-6 py-3.5 hover:bg-neutral-200 transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(255,255,255,0.1)]"
            >
              Browse Active Grid
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="rounded-xl bg-transparent border border-white/10 hover:border-purple-500/30 text-white font-display text-xs font-bold px-6 py-3.5 hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              Configure Live Dashboard
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
