import { EventEmitter } from '@angular/core';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Cropper from 'cropperjs';
@Component({
  selector: 'lukso-edit-public-data',
  templateUrl: './edit-public-data.component.html',
  styleUrls: ['./edit-public-data.component.scss'],
})
export class EditPublicDataComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() saveing = new EventEmitter();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        firstName: [this.data?.firstName, [Validators.required]],
        lastName: [this.data?.lastName, [Validators.required]],
        bio: [this.data?.bio, [Validators.required]],
      },
      { updateOn: 'change' }
    );
  }

  ngOnInit(): void {
    // const image = document.querySelector('#cropper') as HTMLImageElement;
    // const cropper = new Cropper(image, {
    //   viewMode: 3,
    //   dragMode: 'move',
    //   aspectRatio: 300 / 400,
    //   autoCropArea: 1,
    //   restore: false,
    //   modal: false,
    //   guides: true,
    //   highlight: false,
    //   cropBoxMovable: false,
    //   cropBoxResizable: false,
    //   toggleDragModeOnDblclick: false,
    //   crop(event) {
    //     console.log(event);
    //   },
    // });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.form.setValue(changes.data.currentValue);
    }
  }

  submit(form: FormGroup) {
    if (form.valid) {
      this.saveing.emit(form);
    }
  }

  onNoClick(): void {}
}
