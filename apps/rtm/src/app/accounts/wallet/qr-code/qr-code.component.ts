import QRCode from 'qrcode';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lukso-qr-code',
  template: `
    <div class="qr-code">
      <img [src]="qrCode | async" (click)="navigateToBlockExplorer(address)" /><br />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        opacity: 0.8;
      }

      :host:hover {
        opacity: 1;
        cursor: pointer;
      }
    `,
  ],
})
export class QrCodeComponent implements OnInit, OnChanges {
  @Input() address!: string;
  @Input() size = 240;
  qrCode: Promise<string> | undefined;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    this.qrCode = QRCode.toDataURL(changes.address.currentValue, {
      width: this.size,
      color: {
        dark: '#2c2c2c',
        light: '#fff',
      },
    });
  }

  navigateToBlockExplorer(address: string) {
    window.open('https://blockscout.com/lukso/l14/address/' + address + '/transactions', '_blank');
  }
}
