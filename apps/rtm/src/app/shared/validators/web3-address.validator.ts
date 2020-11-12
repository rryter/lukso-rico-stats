import { AbstractControl, ValidatorFn } from '@angular/forms';
import { utils } from 'ethers';
export function isETHAddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return utils.isAddress(control.value) ? null : { isETHAddress: { value: control.value } };
  };
}
