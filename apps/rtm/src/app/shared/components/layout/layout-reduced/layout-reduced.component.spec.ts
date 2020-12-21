import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LayoutReducedComponent } from './layout-reduced.component';

describe('LayoutReducedComponent', () => {
  let component: LayoutReducedComponent;
  let fixture: ComponentFixture<LayoutReducedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutReducedComponent],
      providers: [{ provide: ProxyAccountService, useValue: jest.fn() }, provideMockStore({})],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
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
