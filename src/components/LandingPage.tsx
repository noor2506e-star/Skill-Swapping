import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Code, RefreshCw, Sparkles, Server, Users, ArrowRight, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
}

export default function LandingPage({ setCurrentPage }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: 'Initialize Profile',
      desc: 'Declare the skills you offer and what you are eager to acquire. Fill out your Expo bio inside your custom dashboard.',
      icon: Code,
      color: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/25',
    },
    {
      id: 2,
      title: 'Algorithmic Matching',
      desc: 'Our real-time engine pairs you with participants that have exact complementaries (your offers match their desires and vice-versa).',
      icon: RefreshCw,
      color: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/25',
    },
    {
      id: 3,
      title: 'Execute Skill Swap',
      desc: 'Lock in connections, review rating scores, meet on the expo floor or virtually, and accelerate your engineering proficiency!',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/25',
    }
  ];

  const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="mx-auto max-w-7xl px-4 py-8 md:px-8"
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center text-center py-16 md:py-24 overflow-hidden rounded-3xl" id="hero-section">
        {/* Decorative Ambient Glow Balls */}
        <div className="absolute top-10 left-10 -z-10 h-64 w-64 rounded-full bg-neon-purple/20 blur-[100px]" />
        <div className="absolute bottom-10 right-10 -z-10 h-64 w-64 rounded-full bg-neon-cyan/20 blur-[100px]" />

        {/* Expo Header Accent */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-neon-cyan backdrop-blur-sm mb-6"
        >
          <Sparkles className="h-3 w-3 animate-spin text-neon-cyan" />
          Tech Expo 2026 Competitive Matchmaker
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl leading-[1.1] mb-6"
        >
          The Infinite Swapping Node For{' '}
          <span className="bg-gradient-to-r from-neon-purple via-purple-400 to-neon-cyan bg-clip-text text-transparent drop-shadow-sm">
            Expert Developers
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg text-gray-400 max-w-2xl font-light leading-relaxed mb-10"
        >
          Trade raw competencies, co-build prototypes, and level up at the expo. 
          Upload your stack, trigger our matching algorithms, and connect with perfect peers.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button 
            id="hero-primary-cta"
            onClick={() => setCurrentPage('explore')}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple px-8 py-4 font-display font-bold text-dark-surface tracking-wide transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] cursor-pointer"
          >
            Explore Active Skills
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 duration-300" />
          </button>

          <button 
            id="hero-secondary-cta"
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 font-display font-semibold text-white transition-all duration-300"
          >
            Configure Profile
          </button>
        </motion.div>

        {/* EXPO METRICS BAR */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl rounded-2xl glass-panel p-6 border border-white/5"
        >
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-extrabold text-neon-cyan">150+</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Skills Exchanged</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-extrabold text-neon-purple">92.4%</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Match Success</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-extrabold text-white">100%</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Expo Checked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-extrabold text-neon-cyan">8 ms</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Pairing Speed</span>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION (ANIMATED STEPPER) */}
      <section className="py-16 border-t border-white/5" id="how-it-works-section">
        <div className="text-center mb-12">
          <span className="font-mono text-xs font-semibold text-neon-purple uppercase tracking-widest">
            Protocol Overview
          </span>
          <h2 className="font-display text-3xl font-extrabold text-white mt-2">
            An Interactive Tri-Phase Exchange
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Review the straightforward mechanism behind our low-friction competitive matchmaking pipeline.
          </p>
        </div>

        {/* STEPPER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* STEP CONTROLLERS */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isSelected = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  id={`step-control-${step.id}`}
                  className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isSelected 
                      ? 'bg-dark-panel border-neon-purple/40 shadow-[0_4px_20px_rgba(168,85,247,0.06)]' 
                      : 'bg-dark-panel/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${step.color} text-white shadow-lg ${step.shadow}`}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-display font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      Phase {step.id}: {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC SHADOW PREVIEW CANVAS */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full relative rounded-2xl glass-panel-glow border border-white/10 p-8 overflow-hidden min-h-[280px] flex flex-col justify-between">
              
              {/* Backglow element corresponding to state color */}
              <div className={`absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/10 blur-[80px] transition-all duration-500`} />
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-neon-cyan uppercase">
                  [ Interactive Viewer ]
                </span>
                <span className="font-mono text-xs text-gray-500">
                  SYSTEM STEP 0{activeStep}
                </span>
              </div>

              {/* Steps render area */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${steps[activeStep-1].color}`} />
                  <h4 className="font-display text-xl font-bold text-white">
                    {steps[activeStep-1].title}
                  </h4>
                </div>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  {steps[activeStep-1].desc}
                </p>
              </motion.div>

              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-400 font-mono">
                <span>Latency: 2ms</span>
                <div className="flex gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${activeStep === 1 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
                  <div className={`h-1.5 w-1.5 rounded-full ${activeStep === 2 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
                  <div className={`h-1.5 w-1.5 rounded-full ${activeStep === 3 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION HUB BANNER */}
      <section className="my-12 rounded-3xl bg-gradient-to-r from-neon-purple/10 to-neon-cyan/15 border border-neon-purple/20 p-8 sm:p-12 relative overflow-hidden" id="explore-cta-banner">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="max-w-xl">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Ready to find your pairing node?
          </h2>
          <p className="text-sm text-gray-300 mt-3 font-light leading-relaxed">
            Jump onto the active directory grid. Perform real-time filter queries, check attendee qualifications, and synchronize mutual swaps instantly!
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentPage('explore')}
              className="rounded-full bg-white text-dark-surface font-display text-sm font-bold px-6 py-3 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Browse Active Grid
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="rounded-full bg-transparent border border-white/20 text-white font-display text-sm font-medium px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Configure Live Dashboard
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
