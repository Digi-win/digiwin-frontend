"use client";

import { useEffect, useState } from "react";
import { fetchCallReadOnlyFunction, uintCV, cvToJSON, cvToValue } from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";
import GameCard from "./GameCard";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "@/lib/contracts";

interface Game {
  id: number;
  creator: string;
  prizePool: string;
  min: number;
  max: number;
  status: "active" | "won";
}

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const network = { ...STACKS_MAINNET, fetchFn: fetch };
        
        console.log("Fetching games from contract:", CONTRACT_ADDRESS, CONTRACT_NAME);
        
        // 1. Get total number of games
        const totalGamesRes = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-total-games',
          functionArgs: [],
          network,
          senderAddress: CONTRACT_ADDRESS,
        });
        
        // get-total-games returns (ok uint)
        const totalGamesValue = cvToValue(totalGamesRes);
        const totalGames = typeof totalGamesValue === 'object' && 'value' in totalGamesValue 
          ? Number(totalGamesValue.value) 
          : 0;
        
        console.log("Total games:", totalGames);
        
        if (totalGames === 0) {
          setIsLoading(false);
          return;
        }

        // 2. Fetch last 20 games (or all if less than 20)
        const limit = 20;
        const startIndex = Math.max(0, totalGames - limit);
        const promises = [];

        for (let i = totalGames - 1; i >= startIndex; i--) {
          promises.push(
            (async () => {
              try {
                // Get game info - returns (some {...}) or none
                const gameInfoRes = await fetchCallReadOnlyFunction({
                  contractAddress: CONTRACT_ADDRESS,
                  contractName: CONTRACT_NAME,
                  functionName: 'get-game-info',
                  functionArgs: [uintCV(i)],
                  network,
                  senderAddress: CONTRACT_ADDRESS,
                });
                
                const gameValue = cvToValue(gameInfoRes);
                console.log(`Game ${i} raw value:`, gameValue);
                
                // Check if it's none (game doesn't exist)
                if (!gameValue || gameValue === null) {
                  console.log(`Game ${i} not found (none)`);
                  return null;
                }
                
                // Extract game data from the optional
                const game = typeof gameValue === 'object' && 'value' in gameValue 
                  ? gameValue.value 
                  : gameValue;
                
                console.log(`Game ${i} parsed:`, game);
                
                // Helper to extract value from Clarity value object
                const extractValue = (val: any): any => {
                  if (val === null || val === undefined) return val;
                  if (typeof val === 'object' && 'value' in val) return extractValue(val.value);
                  return val;
                };
                
                // Check if game is active - returns (ok bool) or (err ...)
                const isActiveRes = await fetchCallReadOnlyFunction({
                  contractAddress: CONTRACT_ADDRESS,
                  contractName: CONTRACT_NAME,
                  functionName: 'is-game-active',
                  functionArgs: [uintCV(i)],
                  network,
                  senderAddress: CONTRACT_ADDRESS,
                });
                
                const isActiveValue = cvToValue(isActiveRes);
                const isActive = typeof isActiveValue === 'object' && 'value' in isActiveValue
                  ? Boolean(isActiveValue.value)
                  : false;
                
                return {
                  id: i,
                  creator: String(extractValue(game.creator)), // Convert principal to string
                  prizePool: (Number(extractValue(game['prize-pool'])) / 1000000).toFixed(2),
                  min: Number(extractValue(game['min-number'])),
                  max: Number(extractValue(game['max-number'])),
                  status: isActive ? "active" as const : "won" as const
                };
              } catch (err) {
                console.error(`Error fetching game ${i}:`, err);
                return null;
              }
            })()
          );
        }

        const fetchedGames = await Promise.all(promises);
        const validGames = fetchedGames.filter((game): game is Game => game !== null);
        
        console.log("Final fetched games:", validGames);
        setGames(validGames);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch games");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        <div className="glass rounded-2xl p-10 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading games from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold mb-2 text-red-400">Error Loading Games</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
        >
          Retry
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <div className="text-6xl mb-4">🎲</div>
        <h3 className="text-2xl font-bold mb-2">No Games Yet</h3>
        <p className="text-gray-400 mb-4">Be the first to create a game!</p>
        <a 
          href="#create" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-all"
        >
          Create Game
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
      {games.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  );
}
