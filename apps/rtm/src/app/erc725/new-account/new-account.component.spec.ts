import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';
import { EthAddressShortPipe } from '@shared/pipes/eth-address-short.pipe';
import { NewAccountComponent } from './new-account.component';

describe('NewAccountComponent', () => {
  let component: NewAccountComponent;
  let fixture: ComponentFixture<NewAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAccountComponent, EthAddressShortPipe],
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
      imports: [MatMenuModule, MatFormFieldModule, MatSelectModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
