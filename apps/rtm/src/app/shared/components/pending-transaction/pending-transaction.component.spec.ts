import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { of } from 'rxjs';

import { PendingTransactionComponent } from './pending-transaction.component';

describe('PendingTransactionComponent', () => {
  let component: PendingTransactionComponent;
  let fixture: ComponentFixture<PendingTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingTransactionComponent],
      providers: [
        {
          provide: LoadingIndicatorService,
          useValue: {
            pendingTransactions$: of([]),
          },
        },
      ],
      imports: [MatIconModule, MatProgressSpinnerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
