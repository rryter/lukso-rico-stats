import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomFormArray, CustomFormGroup } from './list-checkbox.types';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface ValueLabelPair {
  value: number;
  label: string;
}
export interface Item extends ValueLabelPair {
  selected?: boolean;
}

@Component({
  selector: 'lukso-checkbox-list',
  styleUrls: ['./list-checkbox.component.scss'],
  templateUrl: 'list-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCheckboxComponent implements OnChanges {
  @Input() items: Item[] = [];
  @Input() selected: number[] = [];
  @Input() disabled = false;
  @Input() label?: string;
  @Input() filterLabel?: string;
  @Input() nothingSelectedLabel?: string;

  @Output() selectionChanged = new EventEmitter();

  form: FormGroup;
  filteredCheckboxes$: Observable<AbstractControl[]>;
  allSelected: AbstractControl;
  checkboxes: CustomFormArray<Item> = new FormArray([new FormControl()]) as CustomFormArray<Item>;
  selectedItems: Item[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
    this.filteredCheckboxes$ = this.getFilteredCheckboxes();
    this.allSelected = this.form.get('allSelected') as FormControl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.currentValue && changes.items.currentValue[0]) {
      this.initializeForm(changes.items.currentValue, this.selected);
    }

    if (changes.selected && changes.selected.currentValue) {
      this.upateSelected(changes.selected.currentValue);
    }
  }

  private createForm() {
    return this.fb.group({
      searchField: [{ value: '', disabled: false }],
      checkboxes: this.fb.array([]),
      allSelected: [{ value: false, disabled: false }, Validators.required],
    }) as FormGroup;
  }

  private initializeForm(items: Item[], selected: number[]) {
    this.form.setControl(
      'checkboxes',
      this.fb.array(
        items.map((item) => {
          return this.fb.group({
            ...item,
            selected: selected.includes(item.value),
          });
        })
      )
    );

    this.checkboxes = this.form.get('checkboxes') as CustomFormArray<Item>;
    this.filteredCheckboxes$ = this.getFilteredCheckboxes();
    this.selectedItems = this.getSelectedItems();
    this.allSelected.patchValue(this.selected.length === this.items.length);
  }

  private getSelectedItems(): Item[] {
    return this.checkboxes.value.filter((item: Item) => {
      return item.selected;
    });
  }

  private getFilteredCheckboxes(): Observable<AbstractControl[]> {
    this.checkboxes = this.form.get('checkboxes') as CustomFormArray<Item>;
    const searchControl = this.form.get('searchField');
    if (!searchControl) {
      throw new Error('searchField is falsy');
    }

    return searchControl.valueChanges.pipe(
      startWith(''),
      map((searchTerm: string) => {
        if (searchTerm === '') {
          return this.checkboxes.controls;
        }
        return this.checkboxes.controls.filter((formGroup) => {
          return formGroup.value?.label.toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    );
  }

  selectedItemsChanged() {
    this.selectedItems = this.getSelectedItems();
    this.allSelected.setValue(this.selectedItems.length === this.items.length, {
      emitEvent: false,
    });
    this.selectionChanged.emit(this.selectedItems.map((item) => item.value));
  }

  upateSelected(selected: number[]) {
    this.checkboxes.setValue(
      this.checkboxes.value.map((value) => {
        value.selected = selected.includes(value.value);
        return value;
      })
    );
    this.selectedItems = this.getSelectedItems();
    this.allSelected.setValue(this.selectedItems.length === this.items.length, {
      emitEvent: false,
    });
  }

  toggleAll(items: Item[], bool: boolean) {
    console.log('toggleAll', items);
    this.checkboxes.setValue(
      items.map((item: Item) => {
        return { ...item, selected: bool };
      })
    );
    this.selectedItemsChanged();
  }

  trackByFunction(index: number, checkbox: CustomFormGroup<Item>) {
    return checkbox.value?.value;
  }
}
