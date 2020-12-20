import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '@shared/interface/account';
import { Web3Service } from '@shared/services/web3.service';
//@ts-ignore
import ERC725 from 'erc725.js';
import schema from '../../../resolver/schema.json';

@Component({
  selector: 'lukso-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  @Input() accountAddress: string | undefined;
  @Input() colouredIcon = false;
  accounts: Account[] = [];
  data: any;
  constructor(private router: Router, private web3Service: Web3Service) {}

  ngOnInit(): void {
    const erc725 = new ERC725(schema, this.accountAddress, this.web3Service.provider);
    this.data = erc725.getAllData();
    const accountsAsString = localStorage.getItem('accounts');
    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    }
  }

  loadExistingAccount(index: number) {
    this.router.navigate(['accounts', this.accounts[index]?.address]);
  }
}
