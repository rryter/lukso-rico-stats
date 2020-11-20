import { FormGroup, FormArray, ValidatorFn, AbstractControlOptions } from '@angular/forms';

export abstract class CustomFormGroup<T> extends FormGroup {
    value: T | undefined;
}

export class CustomFormArray<T> extends FormArray {
    value: T[] = [];
    controls: CustomFormGroup<T>[] = [];
}

export type FormGroupConfig<T> = {
    [P in keyof T]:
        | T[P]
        | [{ value: T[P]; disabled: boolean }, (AbstractControlOptions | ValidatorFn | ValidatorFn[])?];
};
