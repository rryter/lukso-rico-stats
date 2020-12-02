import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lukso-overview-claims',
  templateUrl: './overview-claims.component.html',
  styleUrls: ['./overview-claims.component.scss'],
})
export class OverviewClaimsComponent implements OnInit {
  @Input() showAddButton = false;
  constructor() {}

  ngOnInit(): void {}
}
