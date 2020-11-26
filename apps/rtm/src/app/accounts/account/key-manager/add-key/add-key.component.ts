import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
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
    public dialogRef: MatDialogRef<AddKeyComponent>,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    @Inject(MAT_DIALOG_DATA)
    public data: { buttonLabel: string; address: string; privileges: number[] },
    private fb: FormBuilder
  ) {
    this.data.privileges = this.data.privileges || [Capabilities.EXECUTION];
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
      //   this.loadingIndicatorService.showTransactionInfo(`Assigning selected privileges`);
      this.dialogRef.close(addKeyForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
}
