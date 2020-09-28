import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc725Component } from './erc725.component';

describe('Erc725Component', () => {
  let component: Erc725Component;
  let fixture: ComponentFixture<Erc725Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc725Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc725Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
