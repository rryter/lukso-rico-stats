import { Injectable } from '@angular/core';
import { ContractTransaction, Transaction } from 'ethers';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
  PendingTransaction,
  PendingTransactionType,
  TransactionInfo,
} from '@shared/interface/transactions';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  transactionInfo$ = new BehaviorSubject<TransactionInfo | undefined>(undefined);
  pendingTransactions$ = new BehaviorSubject<PendingTransaction[]>([]);
  constructor() {}

  showTransactionInfo(txInfo: TransactionInfo) {
    this.transactionInfo$.next(txInfo);
  }

  hideBlockerBackdrop() {
    this.transactionInfo$.next(undefined);
  }

  addPendingTransaction(
    transaction: Promise<ContractTransaction>,
    type: PendingTransactionType,
    action: string
  ) {
    transaction
      .then((tx) => {
        this.pendingTransactions$.next([{ transaction: tx, type, action }]);
        this.hideBlockerBackdrop();
        return tx.wait();
      })
      .finally(() => {
        this.pendingTransactions$.next([]);
        this.hideBlockerBackdrop();
      });
  }
}
