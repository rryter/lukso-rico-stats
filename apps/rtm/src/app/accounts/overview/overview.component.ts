import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { ERC725Account } from '@twy-gmbh/erc725-playground';

@Component({
  selector: 'lukso-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  accountContract: ERC725Account | undefined;
  constructor(private route: ActivatedRoute, private proxyAccountService: ProxyAccountService) {
    this.route.params.subscribe(async (params) => {
      this.accountContract = this.proxyAccountService.getContract(params.address);
    });
  }

  ngOnInit(): void {}
}
