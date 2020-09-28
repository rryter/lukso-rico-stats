import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Web3WrapperService } from '@lukso/web3-rx';
import { Observable } from 'rxjs';
import { SmartVaultService } from '../../shared/services/smart-vault.service';
import { Vault } from './../../shared/interface/vault';

@Component({
  selector: 'lukso-smart-vault',
  templateUrl: './smart-vault.component.html',
  styleUrls: ['./smart-vault.component.css'],
})
export class SmartVaultComponent {
  vault$: Observable<Vault>;
  address$: Observable<string>;
  networkId$: Observable<number>;
  transactions: {
    locking: boolean;
    withdrawing: boolean;
  } = {
    locking: false,
    withdrawing: false,
  };
  smartVaultContractAddress: any;
  inputAmount = new FormControl(2, Validators.required);

  constructor(
    private smartVaultService: SmartVaultService,
    private web3Service: Web3WrapperService
  ) {
    this.vault$ = this.smartVaultService.vault$;
    this.transactions = this.smartVaultService.transactions;
    this.address$ = this.web3Service.address$;
    this.networkId$ = this.web3Service.networkId$;
    this.smartVaultContractAddress = JSON.parse(window.localStorage.getItem('acl-address'));
  }

  onLockFunds() {
    this.smartVaultService.lockFunds(this.inputAmount.value);
  }

  onWithdrawFunds() {
    this.smartVaultService.withdraw();
  }

  calculateAmount(value: number, percentage: number) {
    this.inputAmount.setValue((value / 100) * percentage);
  }
}
