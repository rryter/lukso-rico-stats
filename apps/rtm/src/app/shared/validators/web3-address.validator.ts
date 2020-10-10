import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isAddress } from 'web3-utils';
export function isETHAddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return isAddress(control.value) ? null : { isETHAddress: { value: control.value } };
  };
}
