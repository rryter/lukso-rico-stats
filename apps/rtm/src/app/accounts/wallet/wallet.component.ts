import QRCode from 'qrcode';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@shared/services/web3.service';
import { AmountComponent } from '@shared/components/dialog/amount/amount.component';
import { Account } from '@shared/interface/account';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Stages } from '@shared/stages.enum';
import { combineLatest, forkJoin, NEVER, Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  pluck,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { utils } from 'ethers';
import { ConfirmDialogOutput } from '@shared/interface/dialog';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { PendingTransaction, PendingTransactionType } from '@shared/interface/transactions';

@Component({
  selector: 'lukso-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent implements OnInit {
  nickName = new FormControl();
  account$: Observable<Account>;
  qrCode: any;
  loading = true;

  proxyAccountContract: ERC725Account | undefined;
  keyManagerContract: ERC734KeyManager | undefined;
  pendingTransactionsFilter = PendingTransactionType.Wallet;
  Stages = Stages;

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService,
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    const address$ = this.route.params.pipe(
      pluck('address'),
      distinctUntilChanged(),
      filter(Boolean)
    ) as Observable<string>;

    this.account$ = combineLatest([
      address$,
      this.web3Service.reloadTrigger$,
      this.loadingIndicatorService.pendingTransactions$,
    ]).pipe(
      switchMap(([address]: [string, boolean, PendingTransaction[]]) => {
        this.proxyAccountContract = this.proxyAccountService.getContract(address);
        return combineLatest([this.proxyAccountContract.owner(), of(address)]).pipe(
          shareReplay(1),
          catchError((error) => {
            console.warn('error', error);
            return NEVER;
          })
        );
      }),
      switchMap(([owner, address]) => {
        this.keyManagerContract = this.keyManagerService.getContract(owner);
        return this.getAccountDetails(address);
      }),
      switchMap((account: Account) => this.enrichAccountWithQrCode(account)),
      catchError((error) => {
        console.error(error);
        return of({} as Account);
      })
    );
  }

  ngOnInit(): void {}

  private enrichAccountWithQrCode(account: Account): Promise<Account> {
    this.loading = false;
    return QRCode.toDataURL(account.address, {
      width: 120,
      color: {
        dark: '#2c2c2c',
        light: '#fff',
      },
    }).then((base64QRCode: string) => {
      account.qrCode = base64QRCode;
      return account;
    });
  }

  private getAccountDetails(address: string): Observable<Account> {
    const accountsAsString = localStorage.getItem('accounts');
    let accounts: Account[];

    if (!accountsAsString) {
      accounts = [] as Account[];
    } else {
      accounts = JSON.parse(accountsAsString);
    }
    const stage = accounts.find((account) => account.address === address)?.stage;

    return forkJoin({
      address: of(address),
      balance: this.getBalance(address),
      isExecutable: this.getIsExecutor(),
      isManagable: this.getIsManager(),
      stage: of(stage),
    }) as Observable<Account>;
  }

  private getIsExecutor(): Promise<boolean> {
    return this.keyManagerService.contract
      .deployed()
      .then(() => {
        return this.keyManagerService.contract.hasPrivilege(this.web3Service.selectedAddress, 2);
      })
      .catch(() => {
        return false;
      });
  }

  private getIsManager(): Promise<boolean> {
    return this.keyManagerService.contract
      .deployed()
      .then(() => {
        return this.keyManagerService.contract.hasPrivilege(this.web3Service.selectedAddress, 1);
      })
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
        this.loadingIndicatorService.addPendingTransaction(
          this.web3Service.signer.sendTransaction({
            to: account.address,
            value: utils.parseEther(dialogOutput.value),
          }),
          PendingTransactionType.Wallet,
          `Topping up Account with ${dialogOutput.value} LYX`
        );
      }
    });
  }

  openWithdrawDialog(account: any) {
    this.dialog
      .open(AmountComponent, {
        data: {
          account,
          confirmLabel: 'Withdraw',
          type: 'withdraw',
        },
      })
      .afterClosed()
      .subscribe((dialogOutput: ConfirmDialogOutput) => {
        this.withDraw(dialogOutput);
      });
  }

  private withDraw(dialogOutput: ConfirmDialogOutput) {
    if (!this.proxyAccountContract) {
      throw Error('proxyAccountContract is not set');
    }
    if (!this.keyManagerContract) {
      throw Error('keyManagerContract is not set');
    }
    if (dialogOutput?.value) {
      console.log(utils.parseEther(dialogOutput.value));
      console.log(this.web3Service.selectedAddress);
      console.log(this.keyManagerContract.address);
      console.log(this.proxyAccountContract.address);
      const abi = this.proxyAccountContract.interface.encodeFunctionData('execute', [
        '0',
        this.web3Service.selectedAddress,
        utils.parseEther(dialogOutput.value),
        '0x00',
      ]);

      this.loadingIndicatorService.addPendingTransaction(
        this.keyManagerContract.execute(abi),
        PendingTransactionType.Wallet,
        `Withdrawing ${dialogOutput.value} LYX`
      );
    }
  }

  navigateToBlockExplorer(address: string) {
    window.open('https://blockscout.com/lukso/l14/address/' + address + '/transactions', '_blank');
  }
}