import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { combineLatest, forkJoin, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BytesLike, utils } from 'ethers';

@Component({
  selector: 'lukso-key-value-infos',
  templateUrl: './key-value-infos.component.html',
  styleUrls: ['./key-value-infos.component.css'],
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

  constructor() {
    this.accountKeyValueInfos$ = this.accountContract$.pipe(
      switchMap((account) => {
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

  setData() {
    combineLatest([this.accountContract$, this.keyManagerContract$]).subscribe(
      async ([accountContract, keyManagerContract]) => {
        const abi = accountContract.interface.encodeFunctionData('setData', [
          utils.formatBytes32String('bio'),
          utils.toUtf8Bytes(
            'Frontend-Developer based in Switzerland. Father of two. Always learning new things.'
          ),
        ]);
        const tx = await keyManagerContract.execute(abi);
        await tx.wait();

        const abi2 = accountContract.interface.encodeFunctionData('setData', [
          utils.formatBytes32String('firstName'),
          utils.toUtf8Bytes('Reto'),
        ]);
        const tx2 = await keyManagerContract.execute(abi2);
        await tx2.wait();

        const abi3 = accountContract.interface.encodeFunctionData('setData', [
          utils.formatBytes32String('lastName'),
          utils.toUtf8Bytes('Ryter'),
        ]);
        const tx3 = await keyManagerContract.execute(abi3);
        await tx3.wait();
      }
    );
  }
}
