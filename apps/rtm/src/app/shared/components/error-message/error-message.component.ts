import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lukso-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent implements OnInit {
  @Input() errorMessage: string | null;
  constructor() {
    this.errorMessage = null;
  }

  ngOnInit(): void {}
}
