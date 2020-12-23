import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '@shared/interface/account';
import { Web3Service } from '@shared/services/web3.service';
import ERC725 from 'erc725.js';
import schema from '../../../resolver/schema.json';

@Component({
  selector: 'lukso-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnChanges {
  @Input() accountAddress: string | undefined;
  @Input() colouredIcon = false;
  accounts: Account[] = [];
  imageUrl: any;
  constructor(private router: Router, private web3Service: Web3Service) {}

  ngOnChanges(changes: any): void {
    console.log(changes);
    if (this.accountAddress) {
      const erc725 = new ERC725(schema, this.accountAddress, this.web3Service.provider);
      this.imageUrl = erc725.fetchData('LSP3Profile').then((data: any) => {
        if (data?.image) {
          return `https://ipfs.io/ipfs/${data.image}`;
        } else {
          return './assets/portrait-placeholder-small.jpg';
        }
      });
    }
  }

  loadExistingAccount(index: number) {
    this.router.navigate(['accounts', this.accounts[index]?.address]);
  }
}
