import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'lukso-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() text = 'Save';
  @Input() loading = { status: false, text: '' };
  @Input() disabled = false;
  @Output() action = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  onAction() {
    this.action.emit();
  }
}
