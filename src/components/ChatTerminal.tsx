import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X } from 'lucide-react';
import { User as UserType } from '../types';

interface ChatTerminalProps {
  activeSwappingTerminal: UserType | null;
  setActiveSwappingTerminal: (user: UserType | null) => void;
  terminalLogs: string[];
  terminalText: string;
  setTerminalText: (text: string) => void;
  sendTerminalMessage: (e: React.FormEvent) => void;
  currentUser: UserType | null;
}

export default function ChatTerminal({
  activeSwappingTerminal,
  setActiveSwappingTerminal,
  terminalLogs,
  terminalText,
  setTerminalText,
  sendTerminalMessage,
  currentUser,
}: ChatTerminalProps) {
  if (!activeSwappingTerminal) return null;

  return (
    <AnimatePresence>
      <div 
        id="swapping-chat-modal" 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="glass-panel-glow w-full max-w-2xl rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col h-[520px] shadow-[0_15px_50px_rgba(168,85,247,0.2)]"
        >
          {/* Terminal Header */}
          <div className="bg-[#030014] border-b border-purple-500/20 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Terminal className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-gray-200 uppercase tracking-wider">
                SECURE CHAT NODE // {activeSwappingTerminal.name.toUpperCase()}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <button
              onClick={() => setActiveSwappingTerminal(null)}
              className="text-gray-400 hover:text-white cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal Logs View */}
          <div className="flex-grow p-5 bg-black/95 font-mono text-xs text-left text-gray-300 space-y-2 overflow-y-auto select-text leading-relaxed">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {log.startsWith('[SYS]') && <span className="text-purple-400 font-bold">{log}</span>}
                {log.startsWith('[USER]') && <span className="text-cyan-400 font-bold">{log}</span>}
                {log.startsWith('[REPLY]') && <span className="text-yellow-400 font-bold">{log}</span>}
                {!log.startsWith('[SYS]') && !log.startsWith('[USER]') && !log.startsWith('[REPLY]') && log}
              </div>
            ))}
          </div>

          {/* Terminal Typing Input */}
          <form 
            onSubmit={sendTerminalMessage} 
            className="bg-[#030014] p-3.5 border-t border-purple-500/20 flex items-center space-x-2"
          >
            <span className="font-mono text-xs text-cyan-400 pl-1 shrink-0">
              {currentUser?.name.toLowerCase().replace(/\s+/g, '_') || 'alex_rivera'}@swapio:~$
            </span>
            <input
              id="terminal-input"
              type="text"
              placeholder="Type a direct secure package message here..."
              value={terminalText}
              onChange={(e) => setTerminalText(e.target.value)}
              required
              autoComplete="off"
              className="flex-grow bg-transparent font-mono text-xs text-cyan-300 placeholder-gray-600 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] text-white font-mono text-[10px] font-bold px-4 py-1.5 rounded uppercase tracking-wider cursor-pointer transition-all duration-300 shrink-0"
            >
              EXECUTE
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
