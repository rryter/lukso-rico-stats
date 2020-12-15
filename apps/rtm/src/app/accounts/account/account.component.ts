import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PendingTransactionType } from '@shared/interface/transactions';
import { ContractService } from '@shared/services/contract.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { utils } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { switchMap, map, shareReplay, withLatestFrom, tap } from 'rxjs/operators';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  accountContract$: Observable<ERC725Account>;
  keyManagerContract$: Observable<ERC734KeyManager | undefined>;
  accountData$: Observable<any>;
  saveTrigger$ = new Subject<
    {
      key: string;
      value: Uint8Array;
    }[]
  >();
  constructor(
    private route: ActivatedRoute,
    private loadingIndicatorService: LoadingIndicatorService,
    private contractService: ContractService
  ) {
    this.accountContract$ = this.route.params.pipe(
      map((params) => this.contractService.getAccountContract(params.address)),
      shareReplay(1)
    );

    this.keyManagerContract$ = this.accountContract$.pipe(
      switchMap((accountContract) => this.contractService.getKeyManagerContract(accountContract))
    );

    this.accountData$ = this.accountContract$.pipe(
      switchMap((accountContract) => this.contractService.getAccountDataStore(accountContract))
    );
  }

  ngOnInit() {
    this.saveTrigger$
      .pipe(withLatestFrom(this.accountContract$, this.keyManagerContract$))
      .subscribe(this.updateProfile);
  }

  onSave(form: FormGroup) {
    const keyValuePairs = Object.entries(form.value).map((data: [string, any]) => {
      return { key: utils.formatBytes32String(data[0]), value: utils.toUtf8Bytes(data[1]) };
    });

    this.saveTrigger$.next(keyValuePairs);
  }

  private updateProfile = ([keyValuePairs, accountContract, keyManagerContract]: [
    any,
    ERC725Account,
    ERC734KeyManager | undefined
  ]) => {
    let tx;
    if (keyManagerContract) {
      tx = keyManagerContract.execute(
        accountContract.interface.encodeFunctionData('setDataWithArray', [keyValuePairs])
      );
    } else {
      tx = accountContract.setDataWithArray(keyValuePairs);
    }
    this.loadingIndicatorService.addPromise({
      promise: tx,
      type: PendingTransactionType.Profile,
      action: 'Saving Profile...',
    });
  };
}
