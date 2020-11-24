import { Injectable } from '@angular/core';
import { ContractTransaction, Transaction } from 'ethers';
import { Subject } from 'rxjs';

export interface PendingTransaction {
  transaction: Transaction;
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  loading$ = new Subject<{ isLoading: boolean; text?: string }>();
  pendingTransactions: PendingTransaction[] = [];
  constructor() {}

  showLoadingIndicator(text: string, idendtifier?: string) {
    if (idendtifier) {
      const a: { [key: string]: boolean } = {};
      a[idendtifier] = true;
    }
    this.loading$.next({ isLoading: true, text });
  }

  doneLoading() {
    this.loading$.next({ isLoading: false });
  }

  addPendingTransaction(transaction: Promise<ContractTransaction>, type: string, text: string) {
    this.showLoadingIndicator(text);
    transaction
      .then((tx) => {
        this.pendingTransactions.push({ transaction: tx, type, text });
        this.doneLoading();
        return tx.wait();
      })
      .then((result) => {
        this.pendingTransactions = this.pendingTransactions.filter(
          (pendingTx: PendingTransaction) => {
            return pendingTx.transaction.hash !== result.transactionHash;
          }
        );
      });
  }
}
