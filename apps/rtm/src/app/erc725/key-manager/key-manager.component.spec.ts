import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';
import { KeyManagerComponent } from './key-manager.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeyManagerService } from '@shared/services/key-manager.service';

describe('KeyManagerComponent', () => {
  let component: KeyManagerComponent;
  let fixture: ComponentFixture<KeyManagerComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [KeyManagerComponent],
      providers: [
        { provide: Web3Service, useValue: web3ServiceMock },
        {
          provide: MatDialog,
          useValue: {},
        },
        {
          provide: KeyManagerService,
          useValue: {
            contract: {
              on: jest.fn(),
            },
          },
        },
      ],
      imports: [MatIconModule, MatToolbarModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
