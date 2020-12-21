import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Web3Service } from '@shared/services/web3.service';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { LoadingIndicatorService } from './shared/services/loading-indicator.service';
import { StoreRootState } from './store';
import { selectRouteNestedParam } from './store/selectors';

@Component({
  selector: 'lukso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  transactionInfo$: Observable<any> = of(true);
  constructor(
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service,
    private store: Store<StoreRootState>
  ) {
    this.web3Service.initialize();
    this.transactionInfo$ = this.loadingIndicatorService.transactionInfo$;
  }

  ngOnInit(): void {}
}
