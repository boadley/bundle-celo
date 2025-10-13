import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useAccount, useSendTransaction, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { celo } from 'wagmi/chains';
import { initiatePayment } from '../services/apiService';
import { withRetry } from '../utils/retry';
import { useBalance } from '../contexts/BalanceContext';
import { convertNairaToGToken } from '../utils/celo';

// G$ token contract address on Celo
const G_TOKEN_CONTRACT_ADDRESS = '0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A';

// ERC20 ABI for transferAndCall
const ERC20_ABI = [
  'function transferAndCall(address to, uint256 value, bytes data) returns (bool)'
];

export const useBundle = () => {
  const { address } = useAccount();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const { refreshBalance } = useBalance();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);

  const executePayment = async (
    paymentType: 'bank' | 'airtime', 
    details: {
      amount: number;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
      phoneNumber?: string;
      network?: string;
    },
    onSuccess?: (transactionHash: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    // Check if connected to Celo mainnet
    if (chainId !== celo.id) {
      toast.error(`Please switch to Celo network. Currently on chain ${chainId}, need ${celo.id}`);
      return;
    }

    setIsLoading(true);

    try {
      // Treasury address for receiving G$ payments
      const treasuryAddress = import.meta.env.VITE_TREASURY_ADDRESS as string;
      if (!treasuryAddress) {
        throw new Error('Treasury address not configured');
      }

      // Convert NGN to G$ (1000 NGN = 1 G$)
      const gTokenAmount = convertNairaToGToken(details.amount);
      const gTokenAmountWei = parseUnits(gTokenAmount.toString(), 18);

      console.log('[FRONTEND] Starting payment execution', {
        paymentType,
        amount: details.amount,
        gTokenAmount,
        treasuryAddress,
        userAddress: address
      });

      // Encode payment data for transferAndCall
      const paymentData = ethers.AbiCoder.defaultAbiCoder().encode(
        ['string', 'uint256'],
        [paymentType, details.amount]
      );

      console.log('[FRONTEND] Sending transaction to blockchain...');
      toast.success('Processing payment...');

      // Prepare transaction data
      const transactionData = {
        to: G_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
        data: ethers.Interface.from(ERC20_ABI).encodeFunctionData('transferAndCall', [
          treasuryAddress,
          gTokenAmountWei,
          paymentData
        ]) as `0x${string}`,
      };

      console.log('[FRONTEND] Transaction data prepared:', {
        to: transactionData.to,
        dataLength: transactionData.data.length,
        gTokenAmountWei: gTokenAmountWei.toString()
      });

      // Execute G$ transferAndCall transaction and wait for hash
      const transactionHash = await sendTransactionAsync(transactionData);

      console.log('[FRONTEND] Got transaction hash:', transactionHash);

      // Send transaction details to backend for fiat processing
      console.log('[FRONTEND] Sending to backend for confirmation...');
      await withRetry(
        async () => {
          await initiatePayment({ 
            transactionHash: transactionHash, 
            userAddress: address,
            paymentType, 
            details,
          });
        }
      );

      console.log('[FRONTEND] Payment completed successfully');
      toast.success('Payment completed successfully!');
      
      // Refresh balance after successful transaction
      await refreshBalance();
      
      if (onSuccess) {
        onSuccess(transactionHash);
      }
    } catch (error: any) {
      console.error('[FRONTEND] Payment execution failed:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });

      let errorMessage = 'Payment failed: Unknown error';
      
      if (error?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient G$ balance in wallet';
      } else if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction cancelled by user';
      } else if (error?.message?.includes('Transaction hash not received')) {
        errorMessage = 'Transaction submission timeout - please try again';
      } else if (error?.response?.data?.error) {
        errorMessage = `Payment failed: ${error.response.data.error}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { executePayment, isLoading: isLoading || isPending };
};
