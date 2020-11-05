import QRCode from 'qrcode';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { filter, pluck, switchMap, take, tap } from 'rxjs/operators';
import { utils } from 'ethers';
import { ConfirmDialogOutput } from '@shared/interface/dialog';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';

@Component({
  selector: 'lukso-proxy-account',
  templateUrl: './proxy-account.component.html',
  styleUrls: ['./proxy-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxyAccountComponent implements OnInit {
  nickName = new FormControl();
  account$: Observable<Account>;
  qrCode: any;

  proxyAccountContract: ERC725Account;
  keyManagerContract: ERC734KeyManager;

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
    private keyManagerService: KeyManagerService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.account$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.loadAccount()),
      switchMap((account: Account) => this.enrichAccountWithQrCode(account))
    );
  }

  ngOnInit(): void {}

  private enrichAccountWithQrCode(account: Account): Promise<Account> {
    return QRCode.toDataURL(account.address, {
      width: 100,
      color: {
        dark: '#2c2c2c',
        light: '#fff',
      },
    }).then((base64QRCode: string) => {
      account.qrCode = base64QRCode;
      return account;
    });
  }

  private loadAccount(): Observable<Account> {
    return this.route.params.pipe(
      pluck('address'),
      filter(Boolean),
      switchMap((address: string) => {
        this.proxyAccountContract = this.proxyAccountService.getContract(address);
        return combineLatest([this.proxyAccountContract.owner(), of(address)]);
      }),
      switchMap(([owner, address]) => {
        this.keyManagerContract = this.keyManagerService.getContract(owner);
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
    return this.keyManagerService.contract
      .deployed()
      .then(() => {
        return this.keyManagerService.contract.hasPrivilege(
          this.web3Service.web3.currentProvider.selectedAddress,
          2
        );
      })
      .catch((result) => {
        return false;
      });
  }

  private getIsManager(): Promise<boolean> {
    return this.keyManagerService.contract
      .deployed()
      .then(() => {
        return this.keyManagerService.contract.hasPrivilege(
          this.web3Service.web3.currentProvider.selectedAddress,
          1
        );
      })
      .catch((result) => {
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
            value: utils.parseEther(dialogOutput.value),
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

  openWithdrawDialog(account) {
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
    if (dialogOutput?.value) {
      this.loadingIndicatorService.showLoadingIndicator(`Withdrawing ${dialogOutput.value} LYX`);

      const abi = this.proxyAccountContract.interface.encodeFunctionData('execute', [
        '0',
        this.web3Service.web3.currentProvider.selectedAddress as string,
        utils.parseEther(dialogOutput.value),
        '0x00',
      ]);

      this.keyManagerContract
        .execute(abi)
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loadingIndicatorService.doneLoading();
        });
    }
  }

  navigateToBlockExplorer(address: string) {
    window.open('https://blockscout.com/lukso/l14/address/' + address + '/transactions', '_blank');
  }
}
