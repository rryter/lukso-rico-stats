import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadingIndicatorService } from './shared/services/loading-indicator.service';

@Component({
  selector: 'lukso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading$: Observable<any> = of(true);
  constructor(private loadingIndicatorService: LoadingIndicatorService) {
    this.loading$ = this.loadingIndicatorService.loading$;
  }

  ngOnInit(): void {}
}
