import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lukso-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewAccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
