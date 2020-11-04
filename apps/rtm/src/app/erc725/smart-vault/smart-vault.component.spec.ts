import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Web3Service } from '@lukso/web3-rx';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';

import { SmartVaultComponent } from './smart-vault.component';

describe('SmarVaultComponent', () => {
  let component: SmartVaultComponent;
  let fixture: ComponentFixture<SmartVaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmartVaultComponent],
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
