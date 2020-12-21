import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KeyEditorComponent } from './key-editor.component';

describe('KeyEditorComponent', () => {
  let component: KeyEditorComponent;
  let fixture: ComponentFixture<KeyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyEditorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({}),
            },
          },
        },
      ],
      imports: [ReactiveFormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
