import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[lukso-add-key]',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
})
export class AddKeyComponent implements OnInit {
  newKeyForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.newKeyForm = this.fb.group({
      address: ['', [Validators.required]],
      type: [1],
    });
  }

  ngOnInit(): void {}

  saveNewKey(newKeyForm: FormGroup) {
    if (newKeyForm.valid) {
      console.log('SAVE IT');
    }
  }
}
