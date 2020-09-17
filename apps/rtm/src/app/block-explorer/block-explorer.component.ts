import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContractService } from '../rico/contract.service';
import { Vault } from './../shared/interface/vault';

@Component({
  selector: 'lukso-block-explorer',
  templateUrl: './block-explorer.component.html',
  styleUrls: ['./block-explorer.component.css'],
})
export class BlockExplorerComponent {
  vault$: Observable<Vault>;
  transactions: {
    locking: boolean;
    withdrawing: boolean;
  } = {
    locking: false,
    withdrawing: false,
  };

  inputAmount = new FormControl(2, Validators.required);

  constructor(private contractService: ContractService) {
    this.vault$ = this.contractService.vault$;
    this.transactions = this.contractService.transactions;
  }

  onLockFunds() {
    this.contractService.lockFunds(this.inputAmount.value);
  }

  onWithdraw() {
    this.contractService.withdraw();
  }

  calculateAmount(value: number, percentage: number) {
    this.inputAmount.setValue((value / 100) * percentage);
  }
}
