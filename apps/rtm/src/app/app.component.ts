import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { LoadingIndicatorService } from './shared/services/loading-indicator.service';

@Component({
  selector: 'lukso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  transactionInfo$: Observable<any> = of(true);
  constructor(
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {
    console.log('init app what not');
    this.web3Service.initialize();
    this.transactionInfo$ = this.loadingIndicatorService.transactionInfo$;
  }

  ngOnInit(): void {}
}
