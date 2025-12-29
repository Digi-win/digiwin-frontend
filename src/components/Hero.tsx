"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-3 glass px-6 py-3 rounded-full mb-16">
          <span className="w-2 h-2 bg-green-400 rounded-full pulse-animation"></span>
          <span className="text-sm tracking-wide text-gray-300 uppercase">Live on Stacks Mainnet</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-14 leading-tight tracking-tight">
          <span className="gradient-text">DigiWin</span>
          <br />
          <span className="text-white text-5xl sm:text-6xl lg:text-7xl mt-6 block">Number Guessing Game</span>
        </h1>

        {/* Description */}
        <p className="text-2xl text-gray-300 mb-20 max-w-3xl mx-auto leading-relaxed">
          Create games, make guesses, and win prizes! The first correct guess takes the entire prize pool.
          Powered by smart contracts on the Stacks blockchain.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#games"
            className="w-full sm:w-auto px-8 py-4 animated-gradient rounded-lg font-semibold text-white btn-glow flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Play Now</span>
          </a>
          <a
            href="#create"
            className="w-full sm:w-auto px-8 py-4 glass rounded-lg font-semibold text-white hover:bg-white/10 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Game</span>
          </a>
        </div>

        {/* Stats */}
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="glass p-8 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-3">1,234</div>
            <div className="text-gray-400 text-base">Total Games</div>
          </div>
          <div className="glass p-8 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-3">45.2 STX</div>
            <div className="text-gray-400 text-base">Total Prize Pool</div>
          </div>
          <div className="glass p-8 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-3">892</div>
            <div className="text-gray-400 text-base">Active Players</div>
          </div>
        </div>
      </div>
    </section>
  );
}
