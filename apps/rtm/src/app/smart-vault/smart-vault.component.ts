import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SmartVaultService } from '../shared/services/smart-vault.service';
import { Vault } from './../shared/interface/vault';

@Component({
  selector: 'lukso-smart-vault',
  templateUrl: './smart-vault.component.html',
  styleUrls: ['./smart-vault.component.css'],
})
export class SmartVaultComponent {
  vault$: Observable<Vault>;
  transactions: {
    locking: boolean;
    withdrawing: boolean;
  } = {
    locking: false,
    withdrawing: false,
  };

  inputAmount = new FormControl(2, Validators.required);

  constructor(private smartVaultService: SmartVaultService) {
    this.vault$ = this.smartVaultService.vault$;
    this.transactions = this.smartVaultService.transactions;
  }

  onLockFunds() {
    this.smartVaultService.lockFunds(this.inputAmount.value);
  }

  onWithdraw() {
    this.smartVaultService.withdraw();
  }

  calculateAmount(value: number, percentage: number) {
    this.inputAmount.setValue((value / 100) * percentage);
  }
}
