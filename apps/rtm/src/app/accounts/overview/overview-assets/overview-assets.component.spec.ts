import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAssetsComponent } from './overview-assets.component';

describe('OverviewAssetsComponent', () => {
  let component: OverviewAssetsComponent;
  let fixture: ComponentFixture<OverviewAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
