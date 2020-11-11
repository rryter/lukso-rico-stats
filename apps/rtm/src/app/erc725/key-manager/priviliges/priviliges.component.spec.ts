import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { PriviligesComponent } from './priviliges.component';
import { MatIconModule } from '@angular/material/icon';
import { PrivilegePipe } from '@shared/pipes/privilege.pipe';

describe('PriviligesComponent', () => {
  let component: PriviligesComponent;
  let fixture: ComponentFixture<PriviligesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriviligesComponent, PrivilegePipe],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
        MatChipsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriviligesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
