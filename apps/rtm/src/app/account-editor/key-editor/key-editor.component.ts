import { group, state, style, trigger, useAnimation } from '@angular/animations';
import { transition } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Privileges } from '@shared/capabilities.enum';
import { PendingTransactionType } from '@shared/interface/transactions';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { Web3Service } from '@shared/services/web3.service';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';
import { flash } from 'ngx-animate/lib/attention-seekers';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'lukso-key-editor',
  templateUrl: './key-editor.component.html',
  styleUrls: ['./key-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('error', [
      state('0', style({})),
      state('1', style({})),
      transition('0 => 1', [group([useAnimation(flash)])]),
    ]),
  ],
})
export class KeyEditorComponent implements OnInit {
  @Input() data: { address: string; privileges: number[] } = {
    address: '',
    privileges: [Privileges.EXECUTION],
  };

  newKeyForm: FormGroup;
  selectablePrivileges = [
    {
      value: 1,
      label: 'Management',
      selected: false,
    },
    { value: 2, label: 'Execution', selected: false },
  ];

  saveTrigger$ = new EventEmitter<string>();
  animateError = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private web3Service: Web3Service,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.data.privileges = this.data.privileges || [Privileges.EXECUTION];
    this.newKeyForm = this.fb.group(
      {
        address: [
          this.data.address || this.web3Service.selectedAddress,
          [Validators.required, isETHAddressValidator()],
        ],
        privileges: [this.data.privileges, [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {
    this.saveTrigger$
      .pipe(
        switchMap((address: string) => {
          return this.loadingIndicatorService
            .addPromise({
              promise: this.keyManagerService.deploy(
                this.activatedRoute.parent!.snapshot.data.contracts.accountContract.address,
                address
              ),
              type: PendingTransactionType.All,
              action: 'Deploying Keymanager...',
            })
            .then((contract) => {
              return this.loadingIndicatorService
                .addPromise({
                  promise: this.activatedRoute.parent!.snapshot.data.contracts.accountContract.transferOwnership(
                    contract.address
                  ),
                  type: PendingTransactionType.All,
                  action: 'Transfering Ownership...',
                })
                .then(() => {
                  this.router.navigate([
                    '/accounts',
                    this.activatedRoute.parent!.snapshot.data.contracts.accountContract.address,
                  ]);
                });
            });
        })
      )
      .subscribe();
  }

  onPrivilegesChanged(privileges: number[]) {
    this.newKeyForm.controls.privileges.setValue(privileges);
  }

  next() {
    if (this.newKeyForm.invalid) {
      this.animateError = true;
    }
    setTimeout(() => {
      this.animateError = false;
    }, 500);

    if (this.newKeyForm.valid) {
      this.saveTrigger$.emit(this.newKeyForm.controls.address.value);
    }
  }

  back() {
    this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
  }
}
