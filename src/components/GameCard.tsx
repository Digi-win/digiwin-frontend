"use client";

import { useState } from "react";
import GuessForm from "./GuessForm";

interface GameProps {
  id: number;
  creator: string;
  prizePool: string;
  min: number;
  max: number;
  status: "active" | "won";
}

export default function GameCard({ id, creator, prizePool, min, max, status }: GameProps) {
  const [showGuessForm, setShowGuessForm] = useState(false);

  return (
    <div className="glass rounded-2xl p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-all"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">Game #{id}</div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {creator.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-base font-medium text-gray-200">
              {creator.slice(0, 6)}...{creator.slice(-4)}
            </div>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
          status === "active" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-gray-500/20 text-gray-400 border border-gray-500/20"
        }`}>
          {status === "active" ? "ACTIVE" : "WON"}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-black/30 rounded-xl p-6 border border-white/5">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Prize Pool</div>
          <div className="text-2xl font-bold gradient-text">{prizePool} STX</div>
        </div>
        <div className="bg-black/30 rounded-xl p-6 border border-white/5">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Range</div>
          <div className="text-2xl font-bold text-white">{min} - {max}</div>
        </div>
      </div>

      {/* Action Area */}
      {status === "active" ? (
        showGuessForm ? (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <button 
              onClick={() => setShowGuessForm(false)}
              className="text-xs text-gray-400 hover:text-white mb-2 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to info
            </button>
            <GuessForm gameId={id} min={min} max={max} />
          </div>
        ) : (
          <button
            onClick={() => setShowGuessForm(true)}
            className="w-full py-3 rounded-lg font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center space-x-2 group-hover:border-indigo-500/50"
          >
            <span>Make a Guess</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )
      ) : (
        <button disabled className="w-full py-3 rounded-lg font-semibold bg-white/5 text-gray-500 cursor-not-allowed border border-white/5">
          Game Ended
        </button>
      )}
    </div>
  );
}
