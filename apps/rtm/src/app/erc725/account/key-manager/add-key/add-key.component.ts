import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[lukso-add-key]',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
})
export class AddKeyComponent implements OnInit {
  newKeyForm: FormGroup;
  address: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddKeyComponent>,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    @Inject(MAT_DIALOG_DATA) public data: { address: string }
  ) {
    this.newKeyForm = this.fb.group(
      {
        address: ['', [Validators.required, isETHAddressValidator()]],
        privileges: [[Capabilities.EXECUTION], [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {}

  saveNewKey(addKeyForm: FormGroup) {
    if (addKeyForm.valid) {
      this.loadingIndicatorService.showLoadingIndicator('yay');
      this.dialogRef.close(this.addKey(addKeyForm.value.address, addKeyForm.value.privileges));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private addKey(address: string, purpose: Capabilities[]) {
    return this.keyManagerService.contract.setKey(address, purpose, KEY_TYPE.ECDSA);
  }
}