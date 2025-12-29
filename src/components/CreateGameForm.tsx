"use client";

import { useState } from "react";
import { request, connect } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { useStacks } from "@/components/Providers";
import { CONTRACT_ADDRESS, CONTRACT_NAME, FUNCTIONS } from "@/lib/contracts";

export default function CreateGameForm() {
  const { isConnected } = useStacks();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [fee, setFee] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not connected, trigger wallet connection
    if (!isConnected) {
        try {
            await connect();
            // After connection, the page will reload, so we don't continue here
            return;
        } catch (error) {
            console.error("Wallet connection cancelled or failed", error);
            return;
        }
    }

    setIsLoading(true);

    try {
        const feeMicroStx = Math.floor(fee * 1000000);
        
        // Use standard request method for v8
        const response = await request('stx_callContract', {
            contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
            functionName: FUNCTIONS.CREATE_GAME,
            functionArgs: [
                uintCV(min),
                uintCV(max),
                uintCV(feeMicroStx)
            ],
            network: 'mainnet' // Optional, defaults to mainnet but good to be explicit
        });

        if (response.txid) {
            console.log("Transaction ID:", response.txid);
            alert(`Game creation transaction broadcasted! TxId: ${response.txid}`);
        }
        setIsLoading(false);

    } catch (error) {
        console.error("Contract call failed", error);
        setIsLoading(false);
    }
  };

  return (
    <div id="create" className="max-w-xl mx-auto relative glass rounded-3xl p-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 text-lg">✨</span>
          Create New Game
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Min Number</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Max Number</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                min={min + 1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Entry Fee (STX)</label>
            <div className="relative">
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white pl-12 focus:border-purple-500 transition-colors"
                step="0.1"
                min="0.1"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">STX</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm text-purple-200">
            <p className="flex items-start">
              <span className="mr-2">ℹ️</span>
              Users will try to guess a random number between {min} and {max}. First correct guess wins the total pool!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg text-white
              ${isLoading ? 'bg-purple-500/50 cursor-not-allowed' : 'animated-gradient btn-glow'}
              transition-all flex items-center justify-center space-x-2
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Game...</span>
              </>
            ) : (
              <span>🚀 Launch Game</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
