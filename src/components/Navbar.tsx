"use client";

import Link from "next/link";
import { useState } from "react";
import { connect } from "@stacks/connect";
import { useStacks } from "@/components/Providers";

export default function Navbar() {
  const { isConnected, address, disconnect, updateAddress } = useStacks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConnect = async () => {
    if (isConnected) {
      if (confirm("Disconnect wallet?")) {
        disconnect();
      }
    } else {
      try {
          const response = await connect();
          console.log("Connect response:", response);
          
          // Extract Stacks address from response
          if (response?.addresses?.stx && response.addresses.stx.length > 0) {
            const stacksAddress = response.addresses.stx[0].address;
            updateAddress(stacksAddress);
          }
      } catch (e) {
          console.error("Connect failed or cancelled", e);
      }
    }
  };

  const truncateAddress = (addy: string | null) => {
    if (!addy) return "";
    return `${addy.slice(0, 6)}...${addy.slice(-4)}`;
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
              <span className="text-2xl font-bold text-white">🎲</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              DigiWin
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#games" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Active Games
            </Link>
            <Link href="/#create" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Create Game
            </Link>
            
            {/* Wallet Button */}
            <button
              onClick={handleConnect}
              className={`
                px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300
                ${isConnected 
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 text-white"
                }
              `}
            >
              {isConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>{truncateAddress(address)}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              href="/#games" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Active Games
            </Link>
            <Link 
              href="/#create" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Game
            </Link>
            <button
              onClick={handleConnect}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              {isConnected ? truncateAddress(address) : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
