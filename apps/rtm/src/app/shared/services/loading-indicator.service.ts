import { Injectable } from '@angular/core';
import { ContractTransaction, Transaction } from 'ethers';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { PendingTransaction, PendingTransactionType } from '@shared/interface/transactions';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  loading$ = new Subject<{ isLoading: boolean; text?: string }>();
  pendingTransactions$ = new BehaviorSubject<PendingTransaction[]>([]);
  constructor() {}

  showLoadingIndicator(text: string, idendtifier?: string) {
    if (idendtifier) {
      const a: { [key: string]: boolean } = {};
      a[idendtifier] = true;
    }
    this.loading$.next({ isLoading: true, text });
  }

  hideBlockerBackdrop() {
    this.loading$.next({ isLoading: false });
  }

  addPendingTransaction(
    transaction: Promise<ContractTransaction>,
    type: PendingTransactionType,
    action: string
  ) {
    this.showLoadingIndicator(action);
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
