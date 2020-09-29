import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Web3Service } from '@lukso/web3-rx';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { Account } from './../../shared/interface/account';
import { environment } from '../../../environments/environment';
import { Stages } from '../../shared/stages.enum';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { keccak256, fromAscii, hexToAscii, fromWei, toWei, toBN } from 'web3-utils';

const proxyAccountContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC725Account.json');
const accessControllerContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC734KeyManager.json');
const smartVaultContract = require('../../../../../../../ERC725/implementations/build/contracts/SmartVault.json');

@Component({
  selector: 'lukso-proxy-account',
  templateUrl: './proxy-account.component.html',
  styleUrls: ['./proxy-account.component.scss'],
})
export class ProxyAccountComponent implements OnInit {
  nickName = new FormControl();
  accounts$: Observable<Account[]>;

  proxyAccountContract: any;
  accessControllerContract: any;

  @Input() accounts: any[];
  @Input() stage: any;

  Stages = Stages;

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.accounts$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => {
        return this.loadAllAccounts();
      }),
      throttleTime(100) // get rid off
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = new this.web3Service.web3.eth.Contract(proxyAccountContract.abi);
    this.accessControllerContract = new this.web3Service.web3.eth.Contract(
      accessControllerContract.abi,
      JSON.parse(window.localStorage.getItem('acl-address'))
    );
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
  withdraw(from: string) {
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
    const key = fromAscii('nickName');
    const data = fromAscii(nickName);
    //   this.accessControllerContract.methods.setData(key, data).send({
    //     from: this.web3Service.web3.currentProvider.selectedAddress,
    //   });
  }
}
