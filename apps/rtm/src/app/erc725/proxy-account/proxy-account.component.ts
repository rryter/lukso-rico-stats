import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { Account } from './../../shared/interface/account';
import { Stages } from '../../shared/stages.enum';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { keccak256, fromAscii, hexToAscii, fromWei, toWei, toBN } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';

@Component({
  selector: 'lukso-proxy-account',
  templateUrl: './proxy-account.component.html',
  styleUrls: ['./proxy-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxyAccountComponent implements OnInit {
  nickName = new FormControl();
  accounts$: Observable<Account[]>;

  proxyAccountContract: Contract;
  accessControllerContract: Contract;

  @Input() accounts: any[];
  @Input() stage: any;

  Stages = Stages;

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService,
    private proxyAccountService: ProxyAccountService,
    private keyManagerServerice: KeyManagerService
  ) {
    this.accounts$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.loadAllAccounts()),
      throttleTime(100) // todo: should not be necessary
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = this.proxyAccountService.contract;
    this.accessControllerContract = this.keyManagerServerice.contract;
  }

  private loadAllAccounts(): Observable<Account[]> {
    return forkJoin(
      this.accounts.map((account) => {
        this.proxyAccountContract.options.address = account.address;
        return this.getAccountDetails(account);
      })
    );
  }

  private getAccountDetails(account: any): Observable<Account> {
    return forkJoin({
      address: of(account.address),
      balance: this.getBalance(account.address),
      owner: this.proxyAccountContract.methods.owner().call(),
      nickName: this.getNickName(),
      isExecutable: this.getIsExecutable(),
    }) as Observable<Account>;
  }

  private getIsExecutable(): any {
    if (this.accessControllerContract.options.address) {
      return this.accessControllerContract.methods
        .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 2)
        .call();
    } else {
      return of(true);
    }
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
    this.loadingIndicatorService.showLoadingIndicator(`Funding Account with 2 ETH`);
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
    this.loadingIndicatorService.showLoadingIndicator(`Withdrawing 2 ETH`);
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
