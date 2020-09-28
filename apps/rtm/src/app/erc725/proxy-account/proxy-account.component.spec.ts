import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyAccountComponent } from './proxy-account.component';

describe('ProxyAccountComponent', () => {
  let component: ProxyAccountComponent;
  let fixture: ComponentFixture<ProxyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
