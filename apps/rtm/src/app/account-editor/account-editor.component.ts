import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { fader } from '@shared/animaitons/route.animation';
import { Contracts } from '@shared/interface/contracts';
import { ContractService } from '@shared/services/contract.service';
import { Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

@Component({
  selector: 'lukso-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
  animations: [fader],
})
export class AccountEditorComponent implements OnInit {
  contracts$: Observable<Contracts>;
  constructor(private activatedRoute: ActivatedRoute, private contractService: ContractService) {
    if (!this.activatedRoute.parent) {
      throw Error('Parent not available.');
    }
    this.contracts$ = this.activatedRoute.parent.params.pipe(
      pluck('address'),
      switchMap((address) => {
        return this.contractService.getContractsAndData(address);
      })
    );
  }

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
    // return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
