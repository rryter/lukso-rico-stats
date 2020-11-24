import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';
import { utils } from 'ethers';
import { isContractDeployed } from '@shared/utils/contracts';
@Component({
  templateUrl: './edit-public-data.component.html',
  styleUrls: ['./edit-public-data.component.scss'],
})
export class EditPublicDataComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditPublicDataComponent>,
    private fb: FormBuilder,
    private loadingIndicatorService: LoadingIndicatorService,
    private accountService: ProxyAccountService,
    @Inject(MAT_DIALOG_DATA)
    public data: { firstName: string; lastName: string; bio: string }
  ) {
    this.form = this.fb.group(
      {
        firstName: [this.data?.firstName, [Validators.required]],
        lastName: [this.data?.lastName, [Validators.required]],
        bio: [this.data?.bio, [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {}

  save(form: FormGroup) {
    if (form.valid) {
      this.loadingIndicatorService.showLoadingIndicator('Saving Profile Data...');
      const keyValuePairs = Object.entries(form.value).map((data: [string, any]) => {
        return { key: utils.formatBytes32String(data[0]), value: utils.toUtf8Bytes(data[1]) };
      });

      this.dialogRef.close(keyValuePairs);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
