import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartVaultComponent } from './smart-vault.component';

describe('SmarVaultComponent', () => {
  let component: SmartVaultComponent;
  let fixture: ComponentFixture<SmartVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartVaultComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
