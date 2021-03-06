import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Web3Service } from '@shared/services/web3.service';
import { ConfirmDialogInput } from '@shared/interface/dialog';

@Component({
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss'],
})
export class AmountComponent implements OnInit {
  form: FormGroup;

  wallet = 0;
  percentage = 0;

  confirmLabel: string;
  viewType: string;

  constructor(
    private fb: FormBuilder,
    private web3Service: Web3Service,
    public dialogRef: MatDialogRef<AmountComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmDialogInput
  ) {
    let sourceAddress: string;
    if (data.type === 'withdraw' || data.type === 'send') {
      sourceAddress = data.account.address;
    } else {
      sourceAddress = this.web3Service.selectedAddress;
    }

    this.confirmLabel = data.confirmLabel;
    this.viewType = data.type;
    this.form = this.fb.group({
      amount: [0],
      address: [''],
    });

    if (data.type === 'send') {
      this.form.controls.address.setValidators([Validators.required]);
    }

    this.web3Service.getBalance(sourceAddress).then((result) => {
      this.wallet = result;
      this.percentage = 0;
      this.form.controls.amount.setValidators([Validators.min(0), Validators.max(result)]);
    });
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close();
  }

  getReturnValues() {
    return {
      value: '' + Math.floor(this.form.controls.amount.value * 10000) / 10000,
      address: this.viewType === 'send' ? this.form.controls.address.value : '',
    };
  }

  sliderMoved(percentage: MatSliderChange) {
    this.percentage = percentage.value ? percentage.value : 0;
    const value = (this.wallet / 100) * this.percentage;
    this.form.controls.amount.setValue(Math.floor(value * 10000) / 10000);
  }

  valueChanged(value: number) {
    this.percentage = Math.round((value / this.wallet) * 100);
    this.form.controls.amount.setValue(value);
  }
}
