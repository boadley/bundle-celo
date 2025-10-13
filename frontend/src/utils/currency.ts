// currency.ts - Utility functions for currency conversion
// G$ to NGN conversion for Bundle payments

export const G_TOKEN_NGN_RATE = 1000; // 1 G$ = 1000 NGN

export const calculateGTokenAmount = (ngnAmount: number): number => {
  return ngnAmount / G_TOKEN_NGN_RATE; // Returns G$ amount from NGN
};

export const calculateNgnAmount = (gTokenAmount: number): number => {
  return gTokenAmount * G_TOKEN_NGN_RATE; // Returns NGN amount from G$
};

export const MINIMUM_G_TOKEN = 0.001; // Minimum 0.001 G$ for transactions
