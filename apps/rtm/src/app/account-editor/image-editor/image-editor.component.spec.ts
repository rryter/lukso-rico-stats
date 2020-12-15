import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ImageEditorComponent } from './image-editor.component';

describe.only('ImageEditorComponent', () => {
  let component: ImageEditorComponent;
  let fixture: ComponentFixture<ImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageEditorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: of({}),
            },
          },
        },
      ],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
