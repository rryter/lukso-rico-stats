import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { OverviewClaimsComponent } from './overview-claims.component';

describe('OverviewClaimsComponent', () => {
  let component: OverviewClaimsComponent;
  let fixture: ComponentFixture<OverviewClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewClaimsComponent],
      imports: [MatIconModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
