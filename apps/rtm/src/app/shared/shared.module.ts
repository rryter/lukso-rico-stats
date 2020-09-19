import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { EthAddressShortPipe } from './pipes/eth-address-short.pipe';

@NgModule({
  declarations: [TimeAgoPipe, EthAddressShortPipe],
  imports: [CommonModule],
  exports: [TimeAgoPipe, EthAddressShortPipe],
})
export class SharedModule {}
