import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getGTokenBalance, convertGTokenToNaira } from '../utils/celo';

interface BalanceContextType {
  balance: number | null; // Balance in Naira
  gTokenBalance: number | null; // Balance in G$ tokens
  isLoading: boolean;
  walletAddress: string;
  hasWallet: boolean;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, address } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [gTokenBalance, setGTokenBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalance = async (force = false) => {
    if (!isSignedIn || !address) {
      setBalance(null);
      setGTokenBalance(null);
      return;
    }

    try {
      // Only fetch balance if forced or not fetched recently
      const now = Date.now();
      const TWO_MINUTES = 120000;
      
      if (force || now - lastFetchTime.current >= TWO_MINUTES) {
        setIsLoading(true);
        
        const gBalance = await getGTokenBalance(address);
        const nairaBalance = convertGTokenToNaira(gBalance);
        
        setGTokenBalance(gBalance);
        setBalance(nairaBalance);
        lastFetchTime.current = now;
      }
    } catch (error) {
      if (balance === null) {
        setBalance(0);
        setGTokenBalance(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial balance fetch on login
  useEffect(() => {
    if (isSignedIn && address) {
      fetchBalance(true);
    }
  }, [isSignedIn, address]);

  // Set up 2-minute interval for balance updates
  useEffect(() => {
    if (isSignedIn && address) {
      intervalRef.current = setInterval(() => {
        fetchBalance(false);
      }, 120000); // 2 minutes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSignedIn, address]);

  const refreshBalance = async () => {
    await fetchBalance(true);
  };

  return (
    <BalanceContext.Provider value={{
      balance,
      gTokenBalance,
      isLoading,
      walletAddress: address || '',
      hasWallet: isSignedIn && !!address,
      refreshBalance
    }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}