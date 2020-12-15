import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { BytesLike, utils } from 'ethers';
import { Profile } from '../../../account-editor/profile-editor/profile-editor.component';
@Component({
  selector: 'lukso-overview-account',
  templateUrl: './overview-account.component.html',
  styleUrls: ['./overview-account.component.scss'],
})
export class OverviewAccountComponent implements OnInit, OnChanges {
  @Input() accountContract: any;
  @Input() hideText = false;

  contractChanged$ = new Subject();
  accountDetails$: Observable<Profile>;

  constructor(private web3Service: Web3Service) {
    this.accountDetails$ = merge(this.web3Service.reloadTrigger$, this.contractChanged$).pipe(
      switchMap(() => {
        if (this.accountContract) {
          return forkJoin({
            nickName: this.accountContract
              .getData(utils.formatBytes32String('nickName'))
              .then((result: BytesLike) => utils.toUtf8String(result)),
            bio: this.accountContract
              .getData(utils.formatBytes32String('bio'))
              .then((result: BytesLike) => utils.toUtf8String(result)),
            image: this.accountContract
              .getData(utils.formatBytes32String('image'))
              .then((result: BytesLike) => utils.toUtf8String(result))
              .then((image: string) => {
                if (image) {
                  return 'https://ipfs.io/ipfs/' + image;
                } else {
                  return '/assets/portrait-placeholder.png';
                }
              }),
          }).pipe(
            catchError(() => {
              return of({ nickName: 'WHen', bio: 'Loading' });
            })
          );
        } else {
          return of({ nickName: '', bio: '' });
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
