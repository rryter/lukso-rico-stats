import QRCode from 'qrcode';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { AmountComponent } from '@shared/components/dialog/amount/amount.component';
import { Account } from '@shared/interface/account';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Stages } from '@shared/stages.enum';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { filter, onErrorResumeNext, pluck, switchMap } from 'rxjs/operators';
import { Contract } from 'web3-eth-contract';
import { keccak256, toWei, toBN } from 'web3-utils';
import { ConfirmDialogOutput } from '@shared/interface/dialog';

@Component({
  selector: 'lukso-proxy-account',
  templateUrl: './proxy-account.component.html',
  styleUrls: ['./proxy-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxyAccountComponent implements OnInit {
  nickName = new FormControl();
  account$: Observable<any>;
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
    public dialog: MatDialog
  ) {
    this.account$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.loadAccount()),
      switchMap((account: Account) => this.enrichAccountWithQrCode(account))
    );
  }

  ngOnInit(): void {
    this.proxyAccountContract = this.proxyAccountService.contract;
    this.aclContract = this.keyManagerServerice.contract;
  }

  private enrichAccountWithQrCode(account: Account) {
    return QRCode.toDataURL(account.address, {
      width: 200,
      color: {
        dark: '#2c2c2c',
        light: '#fff',
      },
    }).then((result: string) => {
      account.qrCode = result;
      return account;
    });
  }

  private loadAccount(): Observable<Account> {
    return this.route.params.pipe(
      pluck('address'),
      filter(Boolean),
      switchMap((address: string) => {
        this.proxyAccountContract.options.address = address;
        return combineLatest([this.proxyAccountContract.methods.owner().call(), of(address)]);
      }),
      switchMap(([owner, address]) => {
        this.aclContract.options.address = owner as string;
        return this.getAccountDetails(address);
      })
    );
  }

  private getAccountDetails(address: string): Observable<Account> {
    return forkJoin({
      address: of(address),
      balance: this.getBalance(address),
      isExecutable: this.getIsExecutor(),
      isManagable: this.getIsManager(),
    }) as Observable<Account>;
  }

  private getIsExecutor(): Promise<boolean> {
    return this.aclContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 2)
      .call()
      .catch(() => {
        return false;
      });
  }

  private getIsManager(): Promise<boolean> {
    return this.aclContract.methods
      .keyHasPurpose(keccak256(this.web3Service.web3.currentProvider.selectedAddress), 1)
      .call()
      .catch(() => {
        return false;
      });
  }

  getBalance(address: string): Promise<number> {
    return this.web3Service.getBalance(address);
  }

  topUp(account: Account) {
    const dialogRef = this.dialog.open(AmountComponent, {
      data: {
        account,
        confirmLabel: 'Top up',
        type: 'topup',
      },
    });
    dialogRef.afterClosed().subscribe((dialogOutput: ConfirmDialogOutput) => {
      if (dialogOutput?.value) {
        this.loadingIndicatorService.showLoadingIndicator(
          `Topping up Account with ${dialogOutput.value} LYX`
        );
        this.web3Service.web3.eth
          .sendTransaction({
            from: this.web3Service.web3.currentProvider.selectedAddress,
            to: account.address,
            value: toWei(dialogOutput.value, 'ether'),
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.loadingIndicatorService.doneLoading();
          });
      }
    });
  }

  withdraw(account) {
    const dialogRef = this.dialog.open(AmountComponent, {
      data: {
        account,
        confirmLabel: 'Withdraw',
        type: 'withdraw',
      },
    });
    dialogRef.afterClosed().subscribe((dialogOutput: ConfirmDialogOutput) => {
      if (dialogOutput?.value) {
        this.loadingIndicatorService.showLoadingIndicator(`Withdrawing ${dialogOutput.value} LYX`);

        // let abi = account.contract.methods.execute("0", accounts[2], oneEth, '0x00').encodeABI();
        // await keyManager.execute(abi, {from: owner});
        const value = toBN(toWei(dialogOutput.value, 'ether'));
        this.aclContract.methods
          //uint256 _operation, address _to, uint256 _value, bytes memory _data
          .execute(0, this.web3Service.web3.currentProvider.selectedAddress, value, '0x00')
          .send({
            from: this.web3Service.web3.currentProvider.selectedAddress,
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.loadingIndicatorService.doneLoading();
          });
      }
    });
  }

  setNickName(address: string) {
    this.aclContract.options.address = address;
    //   this.accessControllerContract.methods.setData(key, data).send({
    //     from: this.web3Service.web3.currentProvider.selectedAddress,
    //   });
  }

  navigateToBlockExplorer(address: string) {
    window.open('https://blockscout.com/lukso/l14/address/' + address + '/transactions', '_blank');
  }
}
