import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { ERC725Account } from '@twy-gmbh/erc725-playground';
import { forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { BytesLike, utils } from 'ethers';
@Component({
  selector: 'lukso-overview-account',
  templateUrl: './overview-account.component.html',
  styleUrls: ['./overview-account.component.scss'],
})
export class OverviewAccountComponent implements OnInit, OnChanges {
  @Input() accountContract: any;
  @Input() hideText: false;

  contractChanged$ = new Subject();
  accountDetails$: Observable<{ firstName: string; lastName: string; bio: string }>;

  constructor(private web3Service: Web3Service) {
    this.accountDetails$ = merge(this.web3Service.reloadTrigger$, this.contractChanged$).pipe(
      switchMap(() => {
        if (this.accountContract) {
          return forkJoin({
            firstName: this.accountContract
              .getData(utils.formatBytes32String('firstName'))
              .then((result: BytesLike) => utils.toUtf8String(result)),
            lastName: this.accountContract
              .getData(utils.formatBytes32String('lastName'))
              .then((result: BytesLike) => utils.toUtf8String(result)),
            bio: this.accountContract
              .getData(utils.formatBytes32String('bio'))
              .then((result: BytesLike) => utils.toUtf8String(result)),
          }).pipe(
            catchError(() => {
              return of({ firstName: 'Error', lastName: 'WHen', bio: 'Loading' });
            })
          );
        } else {
          return of({ firstName: '', lastName: '', bio: '' });
        }
      })
    ) as any;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountContract.currentValue) {
      this.contractChanged$.next();
    }
  }
}
