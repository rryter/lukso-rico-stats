import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  loading$ = new Subject<{ isLoading: boolean; text?: string }>();
  constructor() {}

  showLoadingIndicator(text: string, idendtifier?: string) {
    if (idendtifier) {
      const a = {};
      a[idendtifier] = true;
    }
    this.loading$.next({ isLoading: true, text });
  }
  doneLoading() {
    this.loading$.next({ isLoading: false });
  }
}
