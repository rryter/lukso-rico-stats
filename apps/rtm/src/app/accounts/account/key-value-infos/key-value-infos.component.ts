import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { combineLatest, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BytesLike, utils } from 'ethers';
import { MatDialog } from '@angular/material/dialog';
import { EditPublicDataComponent } from './edit-public-data/edit-public-data..component';
import { Web3Service } from '@shared/services/web3.service';

@Component({
  selector: 'lukso-key-value-infos',
  templateUrl: './key-value-infos.component.html',
  styleUrls: ['./key-value-infos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueInfosComponent implements OnInit, OnChanges {
  //   @Input() accountContract: ERC725Account;
  //   @Input() keyManagerContract: ERC734KeyManager;
  @Input() accountContract: any;
  @Input() keyManagerContract: any;

  accountContract$ = new ReplaySubject<ERC725Account>();
  keyManagerContract$ = new ReplaySubject<ERC734KeyManager>();

  accountKeyValueInfos$: Observable<{ [key: string]: string }>;
  displayedColumns: string[] = ['key', 'value'];

  constructor(public dialog: MatDialog, private web3Service: Web3Service) {
    this.accountKeyValueInfos$ = combineLatest([
      this.accountContract$,
      this.web3Service.blocks$,
    ]).pipe(
      switchMap(([account]) => {
        return forkJoin({
          nickName: account
            .getData(utils.formatBytes32String('nickName'))
            .then((result: BytesLike) => utils.toUtf8String(result)),
          bio: account
            .getData(utils.formatBytes32String('bio'))
            .then((result: BytesLike) => utils.toUtf8String(result)),
        });
      }),
      catchError((error) => {
        console.warn(error);
        return of({ nickName: '', bio: '', error });
      })
    );
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountContract?.currentValue) {
      this.accountContract$.next(changes.accountContract.currentValue);
    }

    if (changes.keyManagerContract?.currentValue) {
      this.keyManagerContract$.next(changes.keyManagerContract.currentValue);
    }
  }

  setData(existingData: { firstName: string; lastName: string; bio: string }) {
    const dialogRef = this.dialog.open(EditPublicDataComponent, {
      data: {
        ...existingData,
      },
    });

    dialogRef.afterClosed().subscribe((keyValuePairs: { key: string; value: string }[]) => {
      if (!keyValuePairs) {
        return '';
      }
    });
  }
}
