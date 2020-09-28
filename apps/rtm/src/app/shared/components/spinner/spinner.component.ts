import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lukso-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnChanges {
  @Input() dataLoaded = false;
  showSpinner: boolean;

  constructor() {
    this.showSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataLoaded) {
      this.showSpinner = false;
    }
  }
}
