import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Privileges } from '@shared/capabilities.enum';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';

@Component({
  selector: 'lukso-key-editor',
  templateUrl: './key-editor.component.html',
  styleUrls: ['./key-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyEditorComponent implements OnInit {
  @Input() data: { address: string; privileges: number[] } = {
    address: '',
    privileges: [Privileges.EXECUTION],
  };
  @Output() saveKey = new EventEmitter();

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
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.data.privileges = this.data.privileges || [Privileges.EXECUTION];
    this.newKeyForm = this.fb.group(
      {
        address: [this.data.address, [Validators.required, isETHAddressValidator()]],
        privileges: [this.data.privileges, [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {}

  onPrivilegesChanged(privileges: number[]) {
    this.newKeyForm.controls.privileges.setValue(privileges);
  }

  next() {
    this.saveKey.emit(this.newKeyForm.value);
  }

  back() {
    this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
  }
}
