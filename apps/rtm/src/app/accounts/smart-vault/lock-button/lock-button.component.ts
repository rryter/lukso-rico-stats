import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lukso-lock-button',
  templateUrl: './lock-button.component.html',
})
export class LockButtonComponent {
  @Input() hasPendingTransaction = false;
  @Output() lockFunds = new EventEmitter();
}
