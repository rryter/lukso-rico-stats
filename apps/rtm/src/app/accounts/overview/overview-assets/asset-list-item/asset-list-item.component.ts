import { Component, Input, OnInit } from '@angular/core';
import { Asset } from '@shared/interface/asset';

@Component({
  selector: 'lukso-asset-list-item',
  templateUrl: './asset-list-item.component.html',
  styleUrls: ['./asset-list-item.component.scss'],
})
export class AssetListItemComponent implements OnInit {
  @Input() asset: Asset | undefined;
  constructor() {}

  ngOnInit(): void {}
}
