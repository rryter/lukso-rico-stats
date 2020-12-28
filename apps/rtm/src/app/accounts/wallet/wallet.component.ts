import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@shared/services/web3.service';
import { AmountComponent } from '@shared/components/dialog/amount/amount.component';
import { Account } from '@shared/interface/account';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Stages } from '@shared/stages.enum';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, pluck, tap } from 'rxjs/operators';
import { utils } from 'ethers';
import { ConfirmDialogOutput } from '@shared/interface/dialog';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { PendingTransactionType } from '@shared/interface/transactions';
import { KeyManagerService } from '@shared/services/key-manager.service';

@Component({
  selector: 'lukso-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent implements OnInit {
  name = new FormControl();
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

    this.account$ = this.proxyAccountService.getAccount(address$).pipe(
      tap(() => {
        this.loading = false;
      }),
      catchError((error) => {
        console.error(error);
        return of({} as Account);
      })
    );
  }

  ngOnInit(): void {}

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
        this.loadingIndicatorService.addTransactionPromise({
          promise: this.web3Service.signer.sendTransaction({
            to: account.address,
            value: utils.parseEther(dialogOutput.value),
          }),
          type: PendingTransactionType.Wallet,
          action: `Topping up: ${dialogOutput.value} LYX`,
        });
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
    if (!this.proxyAccountService.contract) {
      throw Error('proxyAccountContract is not set');
    }
    if (!this.keyManagerService.contract) {
      throw Error('keyManagerContract is not set');
    }
    if (dialogOutput?.value) {
      const abi = this.proxyAccountService.contract.interface.encodeFunctionData('execute', [
        '0',
        this.web3Service.selectedAddress,
        utils.parseEther(dialogOutput.value),
        '0x00',
      ]);

      this.loadingIndicatorService.addTransactionPromise({
        promise: this.keyManagerService.contract.execute(abi),
        type: PendingTransactionType.Wallet,
        action: `Withdrawing ${dialogOutput.value} LYX`,
      });
    }
  }
}
