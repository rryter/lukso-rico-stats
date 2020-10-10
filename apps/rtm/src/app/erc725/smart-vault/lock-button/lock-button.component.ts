import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lukso-lock-button',
  templateUrl: './lock-button.component.html',
})
export class LockButtonComponent {
  @Input() hasPendingTransaction: boolean;
  @Output() lockFunds = new EventEmitter();
}