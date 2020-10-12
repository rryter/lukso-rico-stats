import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { Account } from '@shared/interface/account';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Stages } from '@shared/stages.enum';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, onErrorResumeNext, pluck, switchMap, tap, throttleTime } from 'rxjs/operators';
import { Contract } from 'web3-eth-contract';
import { keccak256, toWei } from 'web3-utils';
import QRCode from 'qrcode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Capabilities } from '@shared/capabilities.enum';

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
  aclContract: Contract;

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
      throttleTime(100)
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = this.proxyAccountService.contract;
    this.aclContract = this.keyManagerServerice.contract;
  }

  private loadAccount(): Observable<Account> {
    console.log(this.route);
    return this.route.params.pipe(
      pluck('address'),
      tap((address) => {
        console.log('xxx address proxycontract', address);
      }),
      switchMap((address) => {
        this.proxyAccountContract.options.address = address;
        return combineLatest([this.proxyAccountContract.methods.owner().call(), of(address)]);
      }),
      tap(([owner, address]) => {
        console.log('xxx address actlContract', owner);
      }),
      switchMap(([owner, address]) => {
        this.aclContract.options.address = owner as string;
        return this.getAccountDetails(address);
      })
      //   onErrorResumeNext()
    );
  }

  private getAccountDetails(address: string): Observable<Account> {
    return forkJoin({
      address: of(address),
      balance: this.getBalance(address),
      isExecutable: this.getIsExecutor(),
      isManagable: this.getIsManager(),
    }).pipe(
      tap((result) => {
        console.log('YAY, result', result);
      })
    ) as Observable<Account>;
  }

  private getIsExecutor(): Promise<boolean> {
    return this.aclContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 2)
      .call();
  }

  private getIsManager(): Promise<boolean> {
    return this.aclContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 1)
      .call();
  }

  getBalance(address: string): Promise<number> {
    return this.web3Service.getBalance(address);
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

  setNickName(address: string) {
    this.aclContract.options.address = address;
    //   this.accessControllerContract.methods.setData(key, data).send({
    //     from: this.web3Service.web3.currentProvider.selectedAddress,
    //   });
  }
}
