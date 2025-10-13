import { createContext, useContext, type ReactNode } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';

interface AuthContextType {
  isSignedIn: boolean;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const login = async () => {
    try {
      await open();
    } catch (error: any) {
      throw new Error('Failed to connect wallet. Please try again.');
    }
  };

  const logout = async () => {
    try {
      disconnect();
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isSignedIn: isConnected, 
      address: address || null, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}