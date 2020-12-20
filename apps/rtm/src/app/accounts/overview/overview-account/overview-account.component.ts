import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { Profile } from '../../../account-editor/profile-editor/profile-editor.component';
import { ContractService } from '@shared/services/contract.service';
import { ERC725Account } from '@twy-gmbh/erc725-playground';
import { Contracts } from '@shared/interface/contracts';
@Component({
  selector: 'lukso-overview-account',
  templateUrl: './overview-account.component.html',
  styleUrls: ['./overview-account.component.scss'],
})
export class OverviewAccountComponent implements OnChanges {
  @Input() accountContract: ERC725Account | undefined;
  @Input() hideText = false;

  contractChanged$ = new ReplaySubject<ERC725Account>();
  accountDetails$: Observable<Profile>;
  contracts$: any;

  constructor(private contractService: ContractService) {
    this.contracts$ = this.contractChanged$.pipe(
      switchMap((contract) => {
        return this.contractService.getAccountDataStore(contract.address).then((result) => {
          return result;
        });
      })
    );
    this.accountDetails$ = this.contracts$.pipe(
      map((result: Contracts) => {
        return result;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountContract.currentValue) {
      this.contractChanged$.next(changes.accountContract.currentValue);
    }
  }
}
