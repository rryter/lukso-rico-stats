import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Erc725ExplainerComponent } from './erc725-explainer.component';

describe('Erc725ExplainerComponent', () => {
  let component: Erc725ExplainerComponent;
  let fixture: ComponentFixture<Erc725ExplainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Erc725ExplainerComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc725ExplainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
