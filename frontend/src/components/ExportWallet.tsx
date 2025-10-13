import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../contexts/BalanceContext';
import { toast } from 'react-hot-toast';

export default function ExportWallet() {
  const { isSignedIn, address } = useAuth();
  const { gTokenBalance } = useBalance();
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);

  const showWalletInfo = () => {
    if (!isSignedIn || !address) {
      toast.error('Wallet not connected');
      return;
    }
    
    toast.success(`Wallet Address: ${address}`);
  };

  const transferGToken = async () => {
    if (!isSignedIn || !recipientAddress) {
      toast.error('Please enter recipient address');
      return;
    }

    setIsTransferring(true);
    try {
      // This would need to be implemented with actual G$ transfer logic
      toast.success('G$ transfer functionality would be implemented here');
    } catch (error: any) {
      toast.error(error.message || 'G$ transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Wallet Info (Dev Only)</h3>
      
      <div className="space-y-4">
        <button
          onClick={showWalletInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Show Wallet Address
        </button>
        
        {gTokenBalance && gTokenBalance > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm mb-2">G$ Balance: {gTokenBalance.toFixed(4)} G$</p>
            <input
              type="text"
              placeholder="Recipient address (0x...)" 
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-black"
            />
            <button
              onClick={transferGToken}
              disabled={isTransferring || !recipientAddress}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
            >
              {isTransferring ? 'Transferring...' : `Transfer All G$ (${gTokenBalance.toFixed(4)})`}
            </button>
          </div>
        )}
      </div>
      
      {address && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm font-medium mb-2">Wallet Address:</p>
            <p className="text-xs break-all font-mono bg-white p-2 rounded">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
}