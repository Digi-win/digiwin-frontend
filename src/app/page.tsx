import Hero from "@/components/Hero";
import GamesList from "@/components/GamesList";
import CreateGameForm from "@/components/CreateGameForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      <div id="games" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-40">
        <div className="flex items-center justify-between mb-20">
          <h2 className="text-5xl font-bold tracking-tight">
            <span className="mr-4">🔥</span>
            Active Games
          </h2>
          <div className="flex space-x-4">
            <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-base font-medium transition-colors">
              Newest
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-base font-medium transition-colors">
              Highest Pool
            </button>
          </div>
        </div>
        
        <GamesList />
      </div>

      <div className="bg-gradient-to-b from-transparent to-purple-900/10 py-40 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold mb-8">Start Your Own Game</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Set the rules, define functionality, and let others play. You earn a small fee for every guess!
            </p>
          </div>
          <CreateGameForm />
        </div>
      </div>
    </main>
  );
}
