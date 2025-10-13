import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useBalance } from '../contexts/BalanceContext';

export default function ConnectWalletButton() {
  const { isSignedIn, login } = useAuth();
  const { hasWallet } = useBalance();

  const handleConnect = async () => {
    try {
      await login();
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect wallet';
      toast.error(errorMessage);
    }
  };

  if (!isSignedIn || !hasWallet) {
    return (
      <button
        onClick={handleConnect}
        className="btn-primary"
        title="Connect with MetaMask, WalletConnect, or other supported wallets"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <button className="text-white bg-transparent border border-disabled px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
      Wallet Connected
    </button>
  );
}
