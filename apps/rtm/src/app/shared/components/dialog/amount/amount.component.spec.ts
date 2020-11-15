import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { EthAddressShortPipe } from '@shared/pipes/eth-address-short.pipe';

import { AmountComponent } from './amount.component';
import { CmcPricePipe } from '@shared/pipes/cmc-price.pipe';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { Web3Service } from '@shared/services/web3.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AmountComponent', () => {
  let component: AmountComponent;
  let fixture: ComponentFixture<AmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmountComponent, EthAddressShortPipe, CmcPricePipe],
      providers: [
        { provide: Web3Service, useValue: web3ServiceMock },
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatSliderModule,
        MatDialogModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
