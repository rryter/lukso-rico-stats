import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { Web3Service } from '@shared/services/web3.service';

import { KeyValueInfosComponent } from './key-value-infos.component';

describe('KeyValueInfosComponent', () => {
  let component: KeyValueInfosComponent;
  let fixture: ComponentFixture<KeyValueInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValueInfosComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {},
        },
        {
          provide: Web3Service,
          useValue: web3ServiceMock,
        },
      ],
      imports: [MatTableModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
