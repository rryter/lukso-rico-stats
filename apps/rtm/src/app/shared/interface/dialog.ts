import { Account } from './account';

export interface ConfirmDialogInput {
  confirmLabel: string;
  type: 'topup' | 'withdraw' | 'send';
  account: Account;
}

export interface ConfirmDialogOutput {
  address?: string;
  value: string;
}
