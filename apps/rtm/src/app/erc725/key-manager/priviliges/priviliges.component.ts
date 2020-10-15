import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PriviligesDataSource, PriviligesItem } from './priviliges-datasource';

@Component({
  selector: 'lukso-priviliges',
  templateUrl: './priviliges.component.html',
  styleUrls: ['./priviliges.component.css'],
})
export class PriviligesComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PriviligesItem>;

  @Output() removeKey = new EventEmitter();
  @Input() wallet: string;
  @Input() keys: any;
  dataSource: PriviligesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['key', 'privilege', 'actions'];

  constructor() {}

  ngOnInit() {
    this.dataSource = new PriviligesDataSource(this.keys);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new PriviligesDataSource(changes.keys.currentValue);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  removePrivilege(privilege: PriviligesItem) {
    this.removeKey.emit(privilege.address);
  }
}
