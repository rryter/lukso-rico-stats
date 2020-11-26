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
import { BytesLike, ContractTransaction, utils } from 'ethers';
import { MatDialog } from '@angular/material/dialog';
import { EditPublicDataComponent } from './edit-public-data/edit-public-data..component';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { Web3Service } from '@shared/services/web3.service';
import { isContractDeployed } from '@shared/utils/contracts';
import { PendingTransactionType } from '@shared/interface/transactions';

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

  constructor(
    public dialog: MatDialog,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {
    this.accountKeyValueInfos$ = combineLatest([
      this.accountContract$,
      this.web3Service.blocks$,
    ]).pipe(
      switchMap(([account]) => {
        return forkJoin({
          firstName: account
            .getData(utils.formatBytes32String('firstName'))
            .then((result: BytesLike) => utils.toUtf8String(result)),
          lastName: account
            .getData(utils.formatBytes32String('lastName'))
            .then((result: BytesLike) => utils.toUtf8String(result)),
          bio: account
            .getData(utils.formatBytes32String('bio'))
            .then((result: BytesLike) => utils.toUtf8String(result)),
        });
      }),
      catchError((error) => {
        console.warn(error);
        return of({ firsName: '', lastName: '', bio: '', error });
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
      width: '50vw',
      height: '100%',
      position: {
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe((keyValuePairs: { key: string; value: string }[]) => {
      if (!keyValuePairs) {
        return '';
      }
      this.loadingIndicatorService.showTransactionInfo({
        title: 'Save Profile',
        to: {
          type: 'account',
          address: this.accountContract.address,
        },
        value: '',
      });
      const tx = isContractDeployed(this.keyManagerContract).then((deployedContract) => {
        if (deployedContract) {
          const abi = this.accountContract.interface.encodeFunctionData('setDataWithArray', [
            keyValuePairs,
          ]);

          return this.keyManagerContract.execute(abi);
        } else {
          return this.accountContract.setDataWithArray(keyValuePairs);
        }
      });
      this.loadingIndicatorService.addPendingTransaction(
        tx,
        PendingTransactionType.Profile,
        'Update Profile: Please confirm the transaction...'
      );
    });
  }
}
