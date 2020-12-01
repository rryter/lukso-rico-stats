import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '@shared/interface/account';
@Component({
  selector: 'lukso-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() accountAddress: string | undefined;
  @Input() colouredIcon = false;
  accounts: Account[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
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
