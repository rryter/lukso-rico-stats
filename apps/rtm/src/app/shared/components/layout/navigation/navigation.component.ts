import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lukso-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() accountAddress: string | undefined;
  accounts: Account[] = [];
  constructor() {}

  ngOnInit(): void {
    const accountsAsString = localStorage.getItem('accounts');
    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    }
  }
}
