import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, skip, tap } from 'rxjs/operators';
import { ContractService } from './../rico/contract.service';

@Component({
  selector: 'lukso-rico',
  templateUrl: './rico.component.html',
  styleUrls: ['./rico.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RicoComponent {
  @HostBinding('class.loading') loadingClass = true;

  balance$: Observable<{ tokens: number; percentage: number }>;
  dataLoaded$: Observable<Boolean>;
  updatedAt = undefined;
  constructor(
    private contractService: ContractService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.updatedAt =
      window.localStorage.getItem('updatedAt') || Date.now().toString();

    this.dataLoaded$ = this.balance$.pipe(
      skip(1),
      mapTo(true),
      tap(() => {
        this.loadingClass = false;
        this.updatedAt = Date.now().toString();
        window.localStorage.setItem('updatedAt', this.updatedAt);
      })
    );

    window.setInterval(() => {
      this.updatedAt = window.localStorage.getItem('updatedAt');
      this.changeDetectorRef.markForCheck();
    }, 1000);
  }
}
