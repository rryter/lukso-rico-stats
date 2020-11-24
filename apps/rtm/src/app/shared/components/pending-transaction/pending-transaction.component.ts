import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import {
  LoadingIndicatorService,
  PendingTransaction,
} from '@shared/services/loading-indicator.service';
import { Transaction } from 'ethers';

@Component({
  selector: 'lukso-pending-transaction',
  templateUrl: './pending-transaction.component.html',
  styleUrls: ['./pending-transaction.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ transform: 'translateY(100%)' }))]),
    ]),
  ],
})
export class PendingTransactionComponent implements OnInit, DoCheck {
  pendingTransactions: PendingTransaction[] = [];
  show: boolean = false;
  constructor(private loadingIndicatorService: LoadingIndicatorService) {}

  ngOnInit(): void {}

  ngDoCheck() {
    this.pendingTransactions = this.loadingIndicatorService.pendingTransactions;
  }
}
