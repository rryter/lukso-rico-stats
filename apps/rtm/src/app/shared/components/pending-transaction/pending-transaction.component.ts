import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { PendingTransaction, PendingTransactionType } from '@shared/interface/transactions';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lukso-pending-transaction',
  templateUrl: './pending-transaction.component.html',
  styleUrls: ['./pending-transaction.component.scss'],
  animations: [
    trigger('fadeInAndOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PendingTransactionComponent implements OnInit, DoCheck {
  @Input() filter: PendingTransactionType = PendingTransactionType.All;
  pendingTransactions$: Observable<PendingTransaction[]>;
  show = false;
  constructor(private loadingIndicatorService: LoadingIndicatorService) {
    this.pendingTransactions$ = this.loadingIndicatorService.pendingTransactions$.pipe(
      map((pendingTransactions) => {
        return pendingTransactions.filter((pending: PendingTransaction) => {
          if (this.filter !== PendingTransactionType.All) {
            return pending.type === this.filter;
          }
          return true;
        });
      })
    );
  }

  ngOnInit(): void {}

  ngDoCheck() {}
}
