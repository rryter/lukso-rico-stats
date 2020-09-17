import { TestBed, async } from '@angular/core/testing';
import { RicoComponent } from './rico.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RicoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RicoComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RicoComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'rtm'`, () => {
    const fixture = TestBed.createComponent(RicoComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('rtm');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(RicoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to rtm!'
    );
  });
});
