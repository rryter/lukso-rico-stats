import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';
import { CmcPricePipe } from '@shared/pipes/cmc-price.pipe';
import { EthAddressShortPipe } from '@shared/pipes/eth-address-short.pipe';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent, EthAddressShortPipe, CmcPricePipe, TimeAgoPipe],
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
      imports: [MatSidenavModule, MatIconModule, RouterModule, MatListModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
