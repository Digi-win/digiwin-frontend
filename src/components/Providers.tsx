"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet, type AppKitNetwork } from '@reown/appkit/networks';

// 1. Get projectId (Placeholder)
const projectId = 'd8cd2e5490f6e0fcfe0f657679e2b2b5'; 

// 2. Set the networks
const networks = [bitcoin, bitcoinTestnet] as [AppKitNetwork, ...AppKitNetwork[]];

// 4. Create modal (Reown - optional, keeping for future multi-chain support)
if (typeof window !== 'undefined') {
    const bitcoinAdapter = new BitcoinAdapter({ projectId });
    
    createAppKit({
      adapters: [bitcoinAdapter],
      networks,
      metadata: {
        name: 'DigiWin',
        description: 'DigiWin Stacks Game',
        url: 'https://digiwin.app', 
        icons: ['https://avatars.githubusercontent.com/u/179229932']
      },
      projectId,
      features: {
        analytics: true
      }
    });
}

// Helper to get Stacks address from localStorage (v8 way)
function getStacksAddressFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check for Stacks Connect v8 storage
    const stacksData = localStorage.getItem('stacks-connect');
    if (stacksData) {
      const parsed = JSON.parse(stacksData);
      // v8 stores addresses in a specific format
      if (parsed?.addresses?.stx && parsed.addresses.stx.length > 0) {
        return parsed.addresses.stx[0].address;
      }
    }
    
    // Also check for legacy auth storage
    const authData = localStorage.getItem('blockstack-session');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed?.userData?.profile?.stxAddress?.mainnet) {
        return parsed.userData.profile.stxAddress.mainnet;
      }
    }
  } catch (e) {
    console.error('Error reading wallet address from storage:', e);
  }
  
  return null;
}

// Stacks Context
interface StacksContextValue {
  address: string | null;
  isConnected: boolean;
  disconnect: () => void;
  updateAddress: (addr: string) => void;
}

const StacksContext = createContext<StacksContextValue>({
  address: null,
  isConnected: false,
  disconnect: () => {},
  updateAddress: () => {},
});

export const useStacks = () => useContext(StacksContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Check initial connection state
    const addr = getStacksAddressFromStorage();
    if (addr) {
      console.log("Found existing wallet connection:", addr);
      setAddress(addr);
    }
    
    // Listen for storage changes (when wallet connects/disconnects in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stacks-connect' || e.key === 'blockstack-session') {
        const newAddr = getStacksAddressFromStorage();
        console.log("Storage changed, new address:", newAddr);
        setAddress(newAddr);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateAddress = (addr: string) => {
    console.log("Manually updating address:", addr);
    setAddress(addr);
  };

  const disconnect = () => {
    // Clear Stacks Connect storage
    localStorage.removeItem('stacks-connect');
    localStorage.removeItem('blockstack-session');
    setAddress(null);
  };

  if (!isMounted) return null;

  return (
    <StacksContext.Provider value={{ 
        address, 
        isConnected: !!address,
        disconnect,
        updateAddress
    }}>
      {children}
    </StacksContext.Provider>
  );
}
