"use client";

import GameCard from "./GameCard";

const MOCK_GAMES = [
  {
    id: 1,
    creator: "SP1...ABCD",
    prizePool: "50",
    min: 1,
    max: 100,
    status: "active" as const,
  },
  {
    id: 2,
    creator: "SP2...EFGH",
    prizePool: "120",
    min: 1,
    max: 1000,
    status: "active" as const,
  },
  {
    id: 3,
    creator: "SP3...IJKL",
    prizePool: "25",
    min: 1,
    max: 50,
    status: "active" as const,
  },
  {
    id: 4,
    creator: "SP4...MNOP",
    prizePool: "1000",
    min: 1,
    max: 10000,
    status: "won" as const,
  },
  {
    id: 5,
    creator: "SP5...QRST",
    prizePool: "75",
    min: 1,
    max: 200,
    status: "active" as const,
  },
];

export default function GamesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
      {MOCK_GAMES.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  );
}
