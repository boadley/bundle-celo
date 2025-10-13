// This file has been replaced by utils/celo.ts for G$ token integration
// Keeping legacy exports for compatibility
export const getUSDCBalance = async (address: string): Promise<number> => {
  // Legacy function - redirects to G$ balance
  const { getGTokenBalance } = await import('./celo');
  return getGTokenBalance(address);
};

export {};