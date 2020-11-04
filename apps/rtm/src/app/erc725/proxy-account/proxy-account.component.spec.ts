import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';
import { CmcPricePipe } from '@shared/pipes/cmc-price.pipe';
import { EthAddressShortPipe } from '@shared/pipes/eth-address-short.pipe';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { ProxyAccountComponent } from './proxy-account.component';

describe('ProxyAccountComponent', () => {
  let component: ProxyAccountComponent;
  let fixture: ComponentFixture<ProxyAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProxyAccountComponent, CmcPricePipe, EthAddressShortPipe],
      providers: [
        { provide: Web3Service, useValue: web3ServiceMock },
        { provide: LoadingIndicatorService, useValue: {} },
        { provide: ProxyAccountService, useValue: {} },
        { provide: KeyManagerService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
      imports: [MatCardModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ProxyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
