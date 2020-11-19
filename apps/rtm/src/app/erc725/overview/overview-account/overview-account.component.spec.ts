import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ERC725Account } from '@twy-gmbh/erc725-playground';

import { OverviewAccountComponent } from './overview-account.component';

describe('OverviewAccountComponent', () => {
  let component: OverviewAccountComponent;
  let fixture: ComponentFixture<OverviewAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewAccountComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAccountComponent);
    component = fixture.componentInstance;
    component.accountContract = {} as ERC725Account;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
