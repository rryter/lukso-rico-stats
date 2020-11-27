import { Transaction } from '@ethersproject/transactions';

export interface PendingTransaction {
  transaction: Transaction;
  type: PendingTransactionType;
  action: string;
}

export interface TransactionInfo {
  title: string;
  from?: {
    type: 'wallet' | 'account' | 'keymanager' | 'owner';
    address: string;
  };
  to?: {
    type: 'wallet' | 'account' | 'keymanager' | 'owner';
    address: string;
  };
  value?: string;
}

export const enum PendingTransactionType {
  'All',
  'Wallet',
  'Profile',
  'KeyManager',
}
