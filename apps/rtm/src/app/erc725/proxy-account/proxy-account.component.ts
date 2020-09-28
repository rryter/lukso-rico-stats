import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Web3WrapperService } from '@lukso/web3-rx';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { Account } from './../../shared/interface/account';
import { environment } from '../../../environments/environment';
import { Stages } from '../../shared/stages.enum';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';

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
    private web3Service: Web3WrapperService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    const blocks$ = concat(this.web3Service.web3.eth.getBlock('latest'), this.web3Service.blocks$);
    this.accounts$ = merge(blocks$, this.web3Service.address$, this.web3Service.networkId$).pipe(
      switchMap(() => {
        return this.loadAllAccounts();
      }),
      throttleTime(100)
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = new this.web3Service.web3.eth.Contract(proxyAccountContract.abi);
    this.accessControllerContract = new this.web3Service.web3.eth.Contract(
      accessControllerContract.abi,
      JSON.parse(window.localStorage.getItem('acl-address'))
    );
  }

  createAccount() {
    this.proxyAccountContract
      .deploy({
        data: proxyAccountContract.bytecode,
        arguments: [environment.contracts.key],
      })
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .then((result) => {
        this.accounts.push({ address: result._address });
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts));
      });
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
        .keyHasPurpose(
          this.web3Service.web3.utils.keccak256(
            this.web3Service.web3.currentProvider.selectedAddress
          ),
          2
        )
        .call();
    } else {
      return of(true);
    }
  }

  private getNickName(): any {
    return this.proxyAccountContract.methods
      .getData(this.web3Service.web3.utils.fromAscii('nickName'))
      .call()
      .then((result) => {
        if (result === null) {
          return null;
        }
        return this.web3Service.web3.utils.hexToAscii(result);
      });
  }

  getBalance(address: string) {
    return this.web3Service.getBalance(address).then((balance) => {
      return this.web3Service.web3.utils.fromWei(balance, 'ether');
    });
  }

  topUp(to: string) {
    this.loadingIndicatorService.showLoadingIndicator(`Funding Account with 2 ETH`);
    this.web3Service.web3.eth
      .sendTransaction({
        from: this.web3Service.web3.currentProvider.selectedAddress,
        to,
        value: this.web3Service.web3.utils.toWei('2', 'ether'),
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }
  withdraw(from: string) {
    this.loadingIndicatorService.showLoadingIndicator(`Withdrawing 2 ETH`);
    this.proxyAccountContract.methods
      .withdraw(this.web3Service.web3.utils.toWei('2', 'ether').toString())
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }
  lockFunds(from: string) {
    const funds = this.web3Service.web3.utils.toWei('2', 'ether').toString();
    // this.keyManagerContract.options.address = environment.contracts.key;
    // this.smartVaultContract.options.address = environment.contracts.vault;
    this.accessControllerContract.methods
      .execute(
        from,
        environment.contracts.vault,
        funds,
        this.web3Service.getEncodedCall(smartVaultContract.abi, 'lockFunds')
      )
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      });
  }

  setNickName(address: string, nickName: string) {
    this.accessControllerContract.options.address = address;
    const key = this.web3Service.web3.utils.fromAscii('nickName');
    const data = this.web3Service.web3.utils.fromAscii(nickName);
    //   this.accessControllerContract.methods.setData(key, data).send({
    //     from: this.web3Service.web3.currentProvider.selectedAddress,
    //   });
  }
}
