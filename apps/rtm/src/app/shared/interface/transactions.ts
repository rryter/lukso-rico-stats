import { Transaction } from '@ethersproject/transactions';

export interface PendingTransaction {
  transaction: Transaction;
  type: PendingTransactionType;
  action: string;
}

export const enum PendingTransactionType {
  'All',
  'Wallet',
  'Profile',
  'KeyManager',
}
