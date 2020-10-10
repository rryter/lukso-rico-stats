import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { Account } from '@shared/interface/account';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Stages } from '@shared/stages.enum';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, onErrorResumeNext, pluck, switchMap, tap, throttleTime } from 'rxjs/operators';
import { Contract } from 'web3-eth-contract';
import { fromAscii, fromWei, hexToAscii, keccak256, toBN, toWei } from 'web3-utils';
import QRCode from 'qrcode';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'lukso-proxy-account',
  templateUrl: './proxy-account.component.html',
  styleUrls: ['./proxy-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxyAccountComponent implements OnInit {
  @Input() accounts: any[];
  @Input() stage: any;

  nickName = new FormControl();
  account$: Observable<Account>;
  qrCode: any;

  proxyAccountContract: Contract;
  accessControllerContract: Contract;

  Stages = Stages;

  errorMessage: {
    title: string;
    message: string;
  } = {
    title: null,
    message: null,
  };

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService,
    private proxyAccountService: ProxyAccountService,
    private keyManagerServerice: KeyManagerService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.account$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.loadAccount()),
      tap((account: Account) => {
        if (account?.address) {
          QRCode.toDataURL(
            account.address,
            {
              width: 200,
              color: {
                dark: '#000',
                light: '#fff',
              },
            },
            (err, url) => {
              this.qrCode = url;
            }
          );
        }
      }),
      throttleTime(100) // todo: should not be necessary
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = this.proxyAccountService.contract;
    this.accessControllerContract = this.keyManagerServerice.contract;
  }

  private loadAccount(): Observable<Account> {
    return this.route.params.pipe(
      pluck('address'),
      switchMap((address) => {
        this.proxyAccountContract.options.address = address;
        return this.getAccountDetails(address);
      }),
      onErrorResumeNext()
    );
  }

  private getAccountDetails(address: string): Observable<Account> {
    return forkJoin({
      address: of(address),
      balance: this.getBalance(address),
      isExecutable: this.getIsExecutor(),
      isManagable: this.getIsManager(),
    }).pipe(
      catchError((_error: any, _caught: Observable<Account>) => {
        this._snackBar.open('Account not found.', null, {
          duration: 2000000,
          panelClass: 'error',
        });
        const error = {
          title: 'Account not found.',
          message: `There was a problem when loading the account with the address <code>${address}</code>. Please make sure it is indeed a deployed implementation of an ERC-725 Account.`,
        };
        this.errorMessage = error;
        return of({});
      })
    ) as Observable<Account>;
  }

  private getIsExecutor(): Promise<boolean> {
    return this.accessControllerContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 2)
      .call();
  }

  private getIsManager(): Promise<boolean> {
    return this.accessControllerContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 1)
      .call();
  }

  private getNickName(): any {
    return this.proxyAccountContract.methods
      .getData(fromAscii('nickName'))
      .call()
      .then((result) => {
        if (result === null) {
          return null;
        }
        return hexToAscii(result);
      });
  }

  getBalance(address: string): Promise<string> {
    return this.web3Service.getBalance(address).then((balance) => {
      return fromWei(toBN(balance), 'ether');
    });
  }

  topUp(to: string) {
    this.loadingIndicatorService.showLoadingIndicator(`Receiving 2 LYX`);
    this.web3Service.web3.eth
      .sendTransaction({
        from: this.web3Service.web3.currentProvider.selectedAddress,
        to,
        value: toWei('2', 'ether'),
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  withdraw() {
    this.loadingIndicatorService.showLoadingIndicator(`Sending 2 LYX`);
    this.proxyAccountContract.methods
      .withdraw(toWei('2', 'ether').toString())
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  setNickName(address: string, nickName: string) {
    this.accessControllerContract.options.address = address;
    //   this.accessControllerContract.methods.setData(key, data).send({
    //     from: this.web3Service.web3.currentProvider.selectedAddress,
    //   });
  }
}
