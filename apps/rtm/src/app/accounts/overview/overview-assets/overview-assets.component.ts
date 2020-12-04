import { Component, Input, OnInit } from '@angular/core';
import { Asset } from '@shared/interface/asset';

@Component({
  selector: 'lukso-overview-assets',
  templateUrl: './overview-assets.component.html',
  styleUrls: ['./overview-assets.component.scss'],
})
export class OverviewAssetsComponent implements OnInit {
  @Input() assets: Asset[] = [];
  constructor() {}

  ngOnInit(): void {}
}
