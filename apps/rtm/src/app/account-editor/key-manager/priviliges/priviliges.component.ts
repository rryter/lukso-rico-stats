import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { KeyManagerData } from '../key-manager.component';

export interface PriviligesItem {
  address: string;
  privileges: number[];
  keyType: string;
}
@Component({
  selector: 'lukso-priviliges',
  templateUrl: './priviliges.component.html',
  styleUrls: ['./priviliges.component.scss'],
})
export class PriviligesComponent implements OnChanges {
  @Output() removeKey = new EventEmitter();
  @Output() showEditDialog = new EventEmitter();
  @Output() addNewKey = new EventEmitter();

  @Input() keys!: KeyManagerData[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['key', 'privilege', 'actions'];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.cdRef.detectChanges();
  }

  onRemoveKey(privilege: PriviligesItem) {
    this.removeKey.emit({ ...privilege });
  }

  onEditKey(privilege: PriviligesItem) {
    this.showEditDialog.emit({ ...privilege });
  }

  addKey() {
    this.addNewKey.emit();
  }
}