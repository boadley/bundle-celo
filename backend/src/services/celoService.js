// celoService.js - Backend service for Celo blockchain interactions
// Handles G$ token transaction confirmation via Celo RPC polling

const { ethers } = require('ethers');
require('dotenv').config();

// Celo RPC provider - using official Celo mainnet RPC
const provider = new ethers.JsonRpcProvider('https://forno.celo.org');

// Poll interval and timeout for tx confirmation (in ms)
const POLL_INTERVAL = 3000; // 3s
const POLL_TIMEOUT = 60000; // 60s
const MAX_RETRIES = 3; // Maximum retries for network errors

class CeloService {
  // Confirm transaction by polling Celo RPC
  // Input: txnHash from frontend
  // Returns: { success: bool, blockNumber: string, timestamp: string, error?: string }
  async confirmTransaction(txnHash) {
    const startTime = Date.now();
    let lastError = null;
    let retryCount = 0;
    let pollAttempts = 0;

    console.log(`[CELO] Starting transaction confirmation for ${txnHash}`);
    console.log(`[CELO] Timeout: ${POLL_TIMEOUT/1000}s, Poll interval: ${POLL_INTERVAL/1000}s`);

    // Validate transaction hash format
    if (!txnHash || typeof txnHash !== 'string' || !txnHash.startsWith('0x') || txnHash.length !== 66) {
      console.log(`[CELO] Invalid transaction hash format: ${txnHash}`);
      return {
        success: false,
        error: `Invalid transaction hash format: ${txnHash}`,
        timestamp: new Date().toISOString()
      };
    }

    while (Date.now() - startTime < POLL_TIMEOUT) {
      pollAttempts++;
      try {
        console.log(`[CELO] Poll attempt ${pollAttempts} for ${txnHash}`);
        
        // Get transaction receipt from Celo RPC
        const receipt = await provider.getTransactionReceipt(txnHash);
        retryCount = 0; // Reset retry count on successful API call

        if (receipt) {
          console.log(`[CELO] Receipt found for ${txnHash}:`, {
            status: receipt.status,
            blockNumber: receipt.blockNumber?.toString(),
            gasUsed: receipt.gasUsed?.toString(),
            from: receipt.from,
            to: receipt.to
          });

          // Check if transaction was successful
          if (receipt.status === 1) {
            console.log(`[CELO] Transaction ${txnHash} confirmed successfully`);
            return {
              success: true,
              blockNumber: receipt.blockNumber.toString(),
              timestamp: new Date().toISOString(),
              gasUsed: receipt.gasUsed.toString()
            };
          } else {
            lastError = 'Transaction execution failed';
            console.log(`[CELO] Transaction ${txnHash} failed with status 0`);
            return {
              success: false,
              error: lastError,
              blockNumber: receipt.blockNumber.toString(),
              timestamp: new Date().toISOString()
            };
          }
        }

        // Transaction not found yet
        console.log(`[CELO] No receipt found for ${txnHash}, waiting ${POLL_INTERVAL/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
        continue;

      } catch (error) {
        console.log(`[CELO] Error polling ${txnHash}:`, {
          message: error.message,
          code: error.code,
          retryCount,
          pollAttempts
        });

        // Handle network errors with retry logic
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
          retryCount++;
          if (retryCount <= MAX_RETRIES) {
            console.log(`[CELO] Network error, retrying ${retryCount}/${MAX_RETRIES} in ${POLL_INTERVAL * retryCount}ms`);
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL * retryCount));
            continue;
          }
        }

        lastError = error.message || 'Celo RPC error';
        console.log(`[CELO] Non-retryable error for ${txnHash}: ${lastError}`);
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      }
    }

    // Timeout or persistent error
    const timeoutError = `Transaction confirmation timeout after ${POLL_TIMEOUT/1000}s`;
    console.log(`[CELO] Transaction ${txnHash} confirmation timed out after ${pollAttempts} attempts`);
    return {
      success: false,
      error: lastError || timeoutError,
      timestamp: null,
    };
  }

  // Query G$ token balance
  async getGTokenBalance(accountAddress) {
    try {
      const G_TOKEN_CONTRACT = '0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A';
      const contract = new ethers.Contract(
        G_TOKEN_CONTRACT,
        ['function balanceOf(address account) view returns (uint256)'],
        provider
      );
      
      const balance = await contract.balanceOf(accountAddress);
      return ethers.formatUnits(balance, 18); // G$ has 18 decimals
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CeloService();