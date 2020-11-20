import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutReducedComponent } from './layout-reduced.component';

describe('LayoutReducedComponent', () => {
  let component: LayoutReducedComponent;
  let fixture: ComponentFixture<LayoutReducedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutReducedComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutReducedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
