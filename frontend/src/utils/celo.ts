import { ethers } from 'ethers';

// G$ token contract address on Celo Mainnet
const G_TOKEN_CONTRACT_ADDRESS = '0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A';

// Celo RPC provider
const provider = new ethers.JsonRpcProvider('https://forno.celo.org');

// ERC20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferAndCall(address to, uint256 value, bytes data) returns (bool)'
];

export async function getGTokenBalance(walletAddress: string): Promise<number> {
  try {
    const contract = new ethers.Contract(G_TOKEN_CONTRACT_ADDRESS, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    
    // G$ has 18 decimals on Celo
    const balanceInGToken = Number(ethers.formatUnits(balance, 18));
    
    return balanceInGToken;
  } catch (error: any) {
    return 0;
  }
}

export function convertGTokenToNaira(gTokenAmount: number): number {
  // 1 $G = 1000 NGN
  return gTokenAmount * 1000;
}

export function convertNairaToGToken(nairaAmount: number): number {
  // 1000 NGN = 1 $G
  return nairaAmount / 1000;
}