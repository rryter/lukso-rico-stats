import { Component } from '@angular/core';
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

  constructor(private contractService: ContractService) {
    this.vault$ = this.contractService.vault$;
    this.transactions = this.contractService.transactions;
  }

  lockFunds() {
    this.contractService.lockFunds();
  }

  withdraw() {
    this.contractService.withdraw();
  }

  getBalance() {}
}
