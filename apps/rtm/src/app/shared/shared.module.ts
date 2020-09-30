import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { EthAddressShortPipe } from './pipes/eth-address-short.pipe';
import { CmcPricePipe } from './pipes/cmc-price.pipe';

@NgModule({
  declarations: [TimeAgoPipe, EthAddressShortPipe, CmcPricePipe],
  imports: [CommonModule],
  exports: [TimeAgoPipe, EthAddressShortPipe, CmcPricePipe],
})
export class SharedModule {}
