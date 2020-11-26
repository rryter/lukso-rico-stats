import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { PendingTransaction, TransactionInfo } from '@shared/interface/transactions';

@Component({
  selector: 'lukso-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  transactionInfo$: Observable<TransactionInfo | undefined>;
  constructor(private loadingIndicatorService: LoadingIndicatorService) {
    this.transactionInfo$ = this.loadingIndicatorService.transactionInfo$;
  }

  ngOnInit(): void {}
}
