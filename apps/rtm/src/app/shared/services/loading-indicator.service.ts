import { Injectable } from '@angular/core';
import { Contract, ContractTransaction } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import {
  PendingTransaction,
  PendingTransactionType,
  TransactionInfo,
} from '@shared/interface/transactions';
import { callbackify } from 'util';

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

  addPromise({
    promise,
    type,
    action,
    callBack,
  }: {
    promise: Promise<ContractTransaction | Contract | undefined>;
    type: PendingTransactionType;
    action: string;
    callBack?: Function;
  }) {
    return promise
      .then(
        (tx: Contract | ContractTransaction | undefined): Promise<any> => {
          this.pendingTransactions$.next([{ promise: tx, type, action }]);
          if (!tx) {
            throw Error('whooooooo');
          }

          if (callBack) {
            callBack();
          }

          if (isContractTransaction(tx)) {
            return tx.wait();
          } else {
            return tx.deployed();
          }
        }
      )
      .catch(() => {
        console.log('woot');
      })
      .finally(() => {
        this.pendingTransactions$.next([]);
        this.hideBlockerBackdrop();
      });
  }
}

function isContractTransaction(
  result: ContractTransaction | Contract | undefined
): result is ContractTransaction {
  if (result) {
    return typeof result.wait === 'function';
  }

  return false;
}
