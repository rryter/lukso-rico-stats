import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Web3Service } from '@lukso/web3-rx';
import { ConfirmDialogInput } from '@shared/interface/dialog';

@Component({
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountComponent implements OnInit {
  amount: FormControl;
  address: FormControl;

  wallet: number;
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
      sourceAddress = this.web3Service.web3.currentProvider.selectedAddress;
    }

    this.confirmLabel = data.confirmLabel;
    this.viewType = data.type;
    this.amount = this.fb.control(0);
    if (data.type === 'send') {
      this.address = this.fb.control('', [Validators.required]);
    }

    this.web3Service.getBalance(sourceAddress).then((result) => {
      this.wallet = result;
      this.percentage = 0;
      this.amount.setValidators([Validators.min(0), Validators.max(result)]);
    });
  }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  getReturnValues() {
    return {
      value: '' + Math.floor(this.amount.value * 10000) / 10000,
      address: this.viewType === 'send' ? this.address.value : '',
    };
  }

  sliderMoved(percentage: MatSliderChange) {
    this.percentage = percentage.value;
    const value = (this.wallet / 100) * percentage.value;
    this.amount.setValue(Math.floor(value * 10000) / 10000);
  }

  valueChanged(value) {
    this.percentage = Math.round((value / 100) * this.wallet);
    this.amount.setValue(value);
  }
}
