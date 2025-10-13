import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.url,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for transaction verification
  timeout: 10000, // 10 seconds
});

export interface ResolveAccountRequest {
  bankName: string;
  accountNumber: string;
}

export interface ResolveAccountResponse {
  accountName: string;
}

export interface InitiatePaymentRequest {
  transactionHash: string;
  userAddress: string;
  paymentType: 'bank' | 'airtime';
  details: {
    amount: number;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    phoneNumber?: string;
    network?: string;
  };
}

export const resolveAccount = async (request: ResolveAccountRequest): Promise<ResolveAccountResponse> => {
  const response = await api.post('/resolve-account', request);
  return response.data;
};

export const initiatePayment = async (request: InitiatePaymentRequest): Promise<void> => {
  console.log('[API] Sending payment initiation request:', {
    ...request,
    details: {
      ...request.details,
      accountNumber: request.details.accountNumber ? '***' + request.details.accountNumber.slice(-4) : undefined
    }
  });
  
  try {
    const response = await api.post('/initiate-payment', request);
    console.log('[API] Payment initiation response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[API] Payment initiation failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// [Removed] sponsorTransaction - No longer needed with EVM implementation

export default api;
