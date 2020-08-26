import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, skip, tap } from 'rxjs/operators';
import { ContractService } from './rico/contract.service';
import { TimeAgoPipe } from './shared/pipes/time-ago.pipe';

@Component({
  selector: 'lukso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('class.loading') loadingClass = true;

  balance$: Observable<{ tokens: number; percentage: number }>;
  dataLoaded$: Observable<Boolean>;
  updatedAt = undefined;
  constructor(
    private contractService: ContractService,
    private changeDetectorRef: ChangeDetectorRef,
    timeAgoPipe: TimeAgoPipe
  ) {
    this.updatedAt =
      window.localStorage.getItem('updatedAt') || Date.now().toString();

    this.balance$ = this.contractService.rICOBalance$;
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
