/**
 * Ensures wallet address is exactly 66 characters (0x + 64 hex chars)
 * Pads with zeros after 0x if needed
 */
export function padWalletAddress(address: string): string {
  if (!address) return address;
  
  if (address.startsWith('0x')) {
    if (address.length < 66) {
      // Pad with zeros after 0x to make it 66 characters total
      return '0x' + address.slice(2).padStart(64, '0');
    }
    if (address.length > 66) {
      // Truncate if somehow longer than 66 characters
      return address.slice(0, 66);
    }
  }
  
  return address;
}

