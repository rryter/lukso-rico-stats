import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
export interface PriviligesItem {
  address: string;
  purpose: string;
  keyType: string;
}
@Component({
  selector: 'lukso-priviliges',
  templateUrl: './priviliges.component.html',
  styleUrls: ['./priviliges.component.css'],
})
export class PriviligesComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PriviligesItem>;

  @Output() removeKey = new EventEmitter();
  @Input() wallet: string;
  @Input() keys: any;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['key', 'privilege', 'actions'];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.cdRef.detectChanges();
  }

  removePrivilege(privilege: PriviligesItem) {
    this.removeKey.emit({ ...privilege });
  }
}
