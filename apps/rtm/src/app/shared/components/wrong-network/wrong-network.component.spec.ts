import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { WrongNetworkComponent } from './wrong-network.component';

describe('WrongNetworkComponent', () => {
  let component: WrongNetworkComponent;
  let fixture: ComponentFixture<WrongNetworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrongNetworkComponent],
      imports: [MatIconModule, MatCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
