import { group, state, style, trigger, useAnimation } from '@angular/animations';
import { transition } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Privileges } from '@shared/capabilities.enum';
import { Contracts } from '@shared/interface/contracts';
import { PendingTransactionType } from '@shared/interface/transactions';
import { ContractService } from '@shared/services/contract.service';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { Web3Service } from '@shared/services/web3.service';
import { isETHAddressValidator } from '@shared/validators/web3-address.validator';
import { flash } from 'ngx-animate/lib/attention-seekers';
import { Observable } from 'rxjs';
import { pluck, switchMap, withLatestFrom } from 'rxjs/operators';

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
  contracts$: Observable<Contracts>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private web3Service: Web3Service,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    private contractService: ContractService
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
    if (!this.activatedRoute.parent) {
      throw Error('Data is missing');
    }
    this.contracts$ = this.activatedRoute.parent?.params.pipe(
      pluck('address'),
      switchMap((address) => {
        return this.contractService.getContractsAndData(address);
      })
    );
  }

  ngOnInit(): void {
    this.saveTrigger$
      .pipe(
        withLatestFrom(this.contracts$),
        switchMap(([address, { accountContract, keyManagerContract }]) => {
          if (!this.activatedRoute.parent) {
            throw Error('Parent not available');
          }

          return this.loadingIndicatorService
            .addPromise({
              promise: this.keyManagerService.deploy(accountContract.address, address),
              type: PendingTransactionType.All,
              action: 'Deploying Keymanager...',
            })
            .then((contract) => {
              return this.loadingIndicatorService
                .addPromise({
                  promise: accountContract.transferOwnership(contract.address),
                  type: PendingTransactionType.All,
                  action: 'Transfering Ownership...',
                })
                .then(() => {
                  this.router.navigate(['/accounts', accountContract.address]);
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

  backToProfile(accountAddress: string) {
    this.router.navigate(['/accounts', accountAddress]);
  }
}
