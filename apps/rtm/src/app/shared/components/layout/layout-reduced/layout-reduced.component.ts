import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lukso-layout-reduced',
  templateUrl: './layout-reduced.component.html',
  styleUrls: ['./layout-reduced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutReducedComponent implements OnInit {
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
