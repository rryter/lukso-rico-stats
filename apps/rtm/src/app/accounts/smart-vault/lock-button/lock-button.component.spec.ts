import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LockButtonComponent } from './lock-button.component';

describe('LockButtonComponent', () => {
  let component: LockButtonComponent;
  let fixture: ComponentFixture<LockButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LockButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
