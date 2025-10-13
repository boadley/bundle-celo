import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celo } from 'wagmi/chains'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get projectId from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a4c97a6942dda38a1de34a6b66647344'

// Create metadata object
const metadata = {
  name: 'Bundle',
  description: 'Spend Crypto on Anything in Nigeria',
  url: window.location.origin,
  icons: ['/favicon.ico']
}

// Convert Celo chain to AppKit network format
const celoNetwork: AppKitNetwork = {
  ...celo,
  chainNamespace: 'eip155'
}

// Set the networks - using Celo mainnet
const networks = [celoNetwork] as [AppKitNetwork, ...AppKitNetwork[]]

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig