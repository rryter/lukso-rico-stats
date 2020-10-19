import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';

@Component({
  selector: 'lukso-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  loading$: Observable<{ isLoading: boolean; text?: string }>;
  constructor(private loadingIndicatorService: LoadingIndicatorService) {}

  ngOnInit(): void {
    this.loading$ = this.loadingIndicatorService.loading$;
  }
}
