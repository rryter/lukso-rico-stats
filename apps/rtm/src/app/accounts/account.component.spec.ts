import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { Erc725Component } from './account.component';

describe('Erc725Component', () => {
  let component: Erc725Component;
  let fixture: ComponentFixture<Erc725Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Erc725Component],
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc725Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
