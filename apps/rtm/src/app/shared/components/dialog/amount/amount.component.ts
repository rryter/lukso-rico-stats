import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Web3Service } from '@lukso/web3-rx';

@Component({
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountComponent implements OnInit {
  amount: FormControl;
  wallet: number;
  percentage = 0;

  constructor(
    private fb: FormBuilder,
    private web3Service: Web3Service,
    public dialogRef: MatDialogRef<AmountComponent>
  ) {
    this.amount = this.fb.control(0);
    this.web3Service
      .getBalance(this.web3Service.web3.currentProvider.selectedAddress)
      .then((result) => {
        this.wallet = result;
        this.percentage = 0;
        this.amount.setValidators([Validators.min(0), Validators.max(result)]);
      });
  }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  sliderMoved(percentage: MatSliderChange) {
    this.percentage = percentage.value;
    this.amount.setValue(((this.wallet / 100) * percentage.value).toPrecision(4));
  }

  valueChanged(value) {
    this.percentage = Math.round((value / 100) * this.wallet);
    this.amount.setValue(value);
  }
}
