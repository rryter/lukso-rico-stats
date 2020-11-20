import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewWalletComponent } from './overview-wallet.component';

describe('OverviewWalletComponent', () => {
  let component: OverviewWalletComponent;
  let fixture: ComponentFixture<OverviewWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewWalletComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
