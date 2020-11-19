import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  showWrongNetworkError$: Observable<{ showWarning: boolean }>;
  accountAddress: string;
  constructor(private web3Service: Web3Service, private route: ActivatedRoute) {
    this.showWrongNetworkError$ = this.web3Service.networkId$.pipe(
      map((networkId) => {
        if (environment.production) {
          return { showWarning: networkId !== 22 }; // L14 LUKSO Testnet}
        }
        return { showWarning: false };
      })
    );
  }
  ngOnInit(): void {}
}
