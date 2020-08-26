import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeBuysComponent } from './large-buys.component';

describe('LargeBuysComponent', () => {
  let component: LargeBuysComponent;
  let fixture: ComponentFixture<LargeBuysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeBuysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeBuysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
