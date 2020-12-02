import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lukso-overview-tokens',
  templateUrl: './overview-tokens.component.html',
  styleUrls: ['./overview-tokens.component.scss'],
})
export class OverviewTokensComponent implements OnInit {
  tokens: any[] = [
    {
      name: 'Oh My Gee',
      symbol: 'OMG',
      amount: 23423423,
      logo: 'https://info.uniswap.org/static/media/eth.73dabb37.png',
    },
    {
      name: 'Too Fast',
      symbol: '2FAST',
      amount: 56756,
      logo:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    },
    {
      name: 'What',
      symbol: 'WAT',
      amount: 345,
      logo:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'NKIE',
      symbol: 'NIK',
      amount: 66,
      logo:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b/logo.png',
    },
    {
      name: 'Whoohoo',
      symbol: 'WOHO',
      amount: 23423423,
      logo:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD46bA6D942050d489DBd938a2C909A5d5039A161/logo.png',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
