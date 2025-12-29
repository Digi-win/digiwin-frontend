"use client";

import { useEffect, useState } from "react";
import { fetchCallReadOnlyFunction, uintCV, cvToJSON } from "@stacks/transactions";
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

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const network = { ...STACKS_MAINNET, fetchFn: fetch };
        
        // 1. Get total number of games
        const totalGamesRes = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-total-games',
          functionArgs: [],
          network,
          senderAddress: CONTRACT_ADDRESS,
        });
        
        const totalGamesJSON = cvToJSON(totalGamesRes);
        const totalGames = parseInt(totalGamesJSON.value);
        
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
            fetchCallReadOnlyFunction({
              contractAddress: CONTRACT_ADDRESS,
              contractName: CONTRACT_NAME,
              functionName: 'get-game-info',
              functionArgs: [uintCV(i)],
              network,
              senderAddress: CONTRACT_ADDRESS,
            }).then(async (res) => {
              const gameData = cvToJSON(res);
              
              if (!gameData.value) return null;
              
              const game = gameData.value.value;
              
              // Check if game is active
              const isActiveRes = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'is-game-active',
                functionArgs: [uintCV(i)],
                network,
                senderAddress: CONTRACT_ADDRESS,
              });
              
              const isActive = cvToJSON(isActiveRes).value;
              
              // Get prize pool
              const prizePoolRes = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-prize-pool',
                functionArgs: [uintCV(i)],
                network,
                senderAddress: CONTRACT_ADDRESS,
              });
              
              const prizePool = cvToJSON(prizePoolRes).value;
              
              return {
                id: i,
                creator: game.creator.value,
                prizePool: (parseInt(prizePool) / 1000000).toFixed(2), // Convert microSTX to STX
                min: parseInt(game.min.value),
                max: parseInt(game.max.value),
                status: isActive ? "active" : "won"
              };
            })
          );
        }

        const fetchedGames = await Promise.all(promises);
        const validGames = fetchedGames.filter((game): game is Game => game !== null);
        
        console.log("Fetched games:", validGames);
        setGames(validGames);
      } catch (error) {
        console.error("Error fetching games:", error);
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
          <p className="text-gray-400">Loading games...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <div className="text-6xl mb-4">🎲</div>
        <h3 className="text-2xl font-bold mb-2">No Games Yet</h3>
        <p className="text-gray-400">Be the first to create a game!</p>
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
