"use client";

import React, { type ReactNode } from "react";
import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet, type AppKitNetwork } from '@reown/appkit/networks';
import { Connect } from '@stacks/connect-react';
import { userSession } from "@/lib/stacks";

// 1. Get projectId (Placeholder)
const projectId = 'd8cd2e5490f6e0fcfe0f657679e2b2b5'; 

// 2. Set the networks
const networks = [bitcoin, bitcoinTestnet] as [AppKitNetwork, ...AppKitNetwork[]];

// 3. Set up Bitcoin Adapter
const bitcoinAdapter = new BitcoinAdapter({
  projectId
});

// 4. Create AppKit instance (Reown - optional for future multi-chain support)
if (typeof window !== 'undefined') {
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

export function Providers({ children }: { children: ReactNode }) {
  const authOptions = {
    appDetails: {
      name: "DigiWin",
      icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '/favicon.ico',
    },
    userSession,
  };

  return (
    <Connect authOptions={authOptions}>
      {children}
    </Connect>
  );
}
