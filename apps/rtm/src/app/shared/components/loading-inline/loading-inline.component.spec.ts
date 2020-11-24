import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingInlineComponent } from './loading-inline.component';

describe('LoadingInlineComponent', () => {
  let component: LoadingInlineComponent;
  let fixture: ComponentFixture<LoadingInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingInlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
