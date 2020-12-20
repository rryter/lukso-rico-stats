import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { ERC725Account } from '@twy-gmbh/erc725-playground';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lukso-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  accountContract$: Observable<ERC725Account | undefined>;
  constructor(private route: ActivatedRoute, private proxyAccountService: ProxyAccountService) {
    this.accountContract$ = this.route.params.pipe(
      map((params) => {
        return this.proxyAccountService.getContract(params.address);
      })
    );
  }

  ngOnInit(): void {}
}
