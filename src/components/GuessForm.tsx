"use client";

import { useState, useEffect } from "react";
import { useConnect } from "@stacks/connect-react";
import { uintCV } from "@stacks/transactions";
import { userSession } from "@/lib/stacks";
import { CONTRACT_ADDRESS, CONTRACT_NAME, FUNCTIONS } from "@/lib/contracts";

interface GuessFormProps {
  gameId: number;
  min: number;
  max: number;
}

export default function GuessForm({ gameId, min, max }: GuessFormProps) {
  const { doContractCall, authenticate } = useConnect();
  const [guess, setGuess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check initial state
    if (userSession && userSession.isUserSignedIn()) {
      setIsSignedIn(true);
    }
    
    // Poll for sign-in state changes
    const interval = setInterval(() => {
      if (userSession && userSession.isUserSignedIn()) {
        if (!isSignedIn) {
          setIsSignedIn(true);
        }
      } else {
        if (isSignedIn) {
          setIsSignedIn(false);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not signed in, trigger authentication
    if (!isSignedIn) {
      authenticate({
        appDetails: {
          name: 'DigiWin',
          icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          setIsSignedIn(true);
        },
        userSession,
      });
      return;
    }

    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < min || guessNum > max) {
      alert(`Please enter a valid number between ${min} and ${max}`);
      return;
    }

    setIsLoading(true);

    try {
      doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: FUNCTIONS.GUESS,
        functionArgs: [
          uintCV(gameId),
          uintCV(guessNum)
        ],
        onFinish: (data) => {
          console.log("Transaction finished:", data);
          alert(`Guess transaction broadcasted! TxId: ${data.txId}`);
          setGuess("");
          setIsLoading(false);
        },
        onCancel: () => {
          console.log("Transaction canceled");
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Contract call failed", error);
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

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
