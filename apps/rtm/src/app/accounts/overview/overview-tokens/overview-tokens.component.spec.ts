import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTokensComponent } from './overview-tokens.component';

describe('OverviewTokensComponent', () => {
  let component: OverviewTokensComponent;
  let fixture: ComponentFixture<OverviewTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
