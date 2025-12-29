"use client";

import { useState } from "react";
import { request, connect } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { useStacks } from "@/components/Providers";
import { CONTRACT_ADDRESS, CONTRACT_NAME, FUNCTIONS } from "@/lib/contracts";

interface GuessFormProps {
  gameId: number;
  min: number;
  max: number;
}

export default function GuessForm({ gameId, min, max }: GuessFormProps) {
  const { isConnected } = useStacks();
  const [guess, setGuess] = useState<string>("");
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
        const guessNum = parseInt(guess);
        if (isNaN(guessNum) || guessNum < min || guessNum > max) {
            alert(`Please enter a valid number between ${min} and ${max}`);
            setIsLoading(false);
            return;
        }

        const response = await request('stx_callContract', {
            contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
            functionName: FUNCTIONS.GUESS,
            functionArgs: [
                uintCV(gameId),
                uintCV(guessNum)
            ],
            network: 'mainnet'
        });

        if (response.txid) {
            console.log("Transaction ID:", response.txid);
            alert(`Guess transaction broadcasted! TxId: ${response.txid}`);
            setGuess("");
        }
        setIsLoading(false);
        
    } catch (error) {
        console.error("Contract call failed", error);
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-white/5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={`Guess (${min}-${max})`}
            min={min}
            max={max}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 transition-colors placeholder-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !guess}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap
            ${isLoading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 btn-glow'}
            transition-all
          `}
        >
          {isLoading ? "..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
