"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "@/lib/stacks";

export default function Navbar() {
  const { authenticate } = useConnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    if (userSession && userSession.isUserSignedIn()) {
      setIsSignedIn(true);
      const userData = userSession.loadUserData();
      const address = userData.profile?.stxAddress?.mainnet || '';
      setUserAddress(address);
    }
  }, []);

  const handleConnect = () => {
    if (isSignedIn) {
      if (confirm("Disconnect wallet?")) {
        userSession.signUserOut();
        setIsSignedIn(false);
        setUserAddress('');
        window.location.reload();
      }
    } else {
      authenticate({
        appDetails: {
          name: 'DigiWin',
          icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = userSession.loadUserData();
          setIsSignedIn(true);
          const address = userData.profile?.stxAddress?.mainnet || '';
          setUserAddress(address);
        },
        userSession,
      });
    }
  };

  const truncateAddress = (addy: string) => {
    if (!addy) return "";
    return `${addy.slice(0, 6)}...${addy.slice(-4)}`;
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;
  
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
                ${isSignedIn 
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 text-white"
                }
              `}
            >
              {isSignedIn ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>{truncateAddress(userAddress)}</span>
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Game
            </Link>
            <button
              onClick={handleConnect}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              {isSignedIn ? truncateAddress(userAddress) : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
