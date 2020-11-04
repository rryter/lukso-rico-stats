import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawButtonComponent } from './withdraw-button.component';

describe('LockButtonComponent', () => {
  let component: WithdrawButtonComponent;
  let fixture: ComponentFixture<WithdrawButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
