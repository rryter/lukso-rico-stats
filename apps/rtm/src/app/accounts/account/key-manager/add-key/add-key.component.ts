import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Privileges } from '@shared/capabilities.enum';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';

@Component({
  // tslint:disable-next-line: component-selector
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
})
export class AddKeyComponent implements OnInit {
  newKeyForm: FormGroup;
  selectablePrivileges = [
    {
      value: 1,
      label: 'Management',
      selected: false,
    },
    { value: 2, label: 'Execution', selected: false },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; buttonText: string; address: string; privileges: number[] },
    public dialogRef: MatDialogRef<AddKeyComponent>,
    private fb: FormBuilder
  ) {
    this.data.privileges = this.data.privileges || [Privileges.EXECUTION];
    this.newKeyForm = this.fb.group(
      {
        address: [this.data.address, [Validators.required, isETHAddressValidator()]],
        privileges: [this.data.privileges, [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  onPrivilegesChanged(privileges: number[]) {
    this.newKeyForm.controls.privileges.setValue(privileges);
  }

  ngOnInit(): void {}

  saveNewKey(addKeyForm: FormGroup) {
    if (addKeyForm.valid) {
      this.dialogRef.close(addKeyForm.value);
    }
  }

  onNoClick(): void {
    console.log('ASDSDASDASDASD');
    this.dialogRef.close(null);
  }
}
