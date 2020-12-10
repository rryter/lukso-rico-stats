import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { PriviligesComponent } from './priviliges.component';
import { MatIconModule } from '@angular/material/icon';
import { PrivilegePipe } from '@shared/pipes/privilege.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EthAddressShortPipe } from '@shared/pipes/eth-address-short.pipe';
import { MatMenuModule } from '@angular/material/menu';

describe('PriviligesComponent', () => {
  let component: PriviligesComponent;
  let fixture: ComponentFixture<PriviligesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriviligesComponent, PrivilegePipe, EthAddressShortPipe],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
        MatChipsModule,
        MatMenuModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriviligesComponent);
    component = fixture.componentInstance;
    component.keys = [];
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
