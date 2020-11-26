import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ProgressComponent } from './progress.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProgressComponent', () => {
  let component: ProgressComponent;
  let fixture: ComponentFixture<ProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressComponent],
      providers: [
        { provide: Web3Service, useValue: web3ServiceMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
      imports: [MatToolbarModule, MatCardModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});