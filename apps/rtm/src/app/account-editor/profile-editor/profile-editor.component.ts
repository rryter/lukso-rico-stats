import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingTransactionType } from '@shared/interface/transactions';
import { ContractService } from '@shared/services/contract.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { utils } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';

export interface Profile {
  nickName: string;
  bio: string;
}

@Component({
  selector: 'lukso-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditorComponent implements OnInit {
  accountContract$: Observable<ERC725Account>;
  keyManagerContract$: Observable<ERC734KeyManager>;
  accountData$: Observable<any>;
  form: FormGroup;
  saveTrigger$ = new Subject<
    {
      key: string;
      value: Uint8Array;
    }[]
  >();
  @Output() saveing = new EventEmitter();
  @Input() profile: Profile = { nickName: '', bio: '' };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.form = this.fb.group(
      {
        nickName: [this.profile.nickName, [Validators.required]],
        bio: [this.profile.bio, [Validators.required]],
      },
      { updateOn: 'change' }
    );

    this.accountContract$ = this.route.parent!.params.pipe(
      map((params) => this.contractService.getAccountContract(params.address)),
      shareReplay(1)
    );

    this.keyManagerContract$ = this.accountContract$.pipe(
      switchMap((accountContract) => this.contractService.getKeyManagerContract(accountContract))
    );

    this.accountData$ = this.accountContract$.pipe(
      switchMap((accountContract) => this.contractService.getAccountDataStore(accountContract))
    );
  }

  ngOnInit() {
    this.saveTrigger$
      .pipe(withLatestFrom(this.accountContract$, this.keyManagerContract$))
      .subscribe(this.updateProfile);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.form.setValue(changes.data.currentValue);
    }
  }

  submit(form: FormGroup) {
    if (form.valid) {
      const keyValuePairs = Object.entries(form.value).map((data: [string, any]) => {
        return { key: utils.formatBytes32String(data[0]), value: utils.toUtf8Bytes(data[1]) };
      });

      this.saveTrigger$.next(keyValuePairs);
    }
  }

  onSave(form: FormGroup) {}

  back() {
    this.router.navigate(['../image'], { relativeTo: this.route });
  }

  private updateProfile = ([keyValuePairs, accountContract, keyManagerContract]: [
    any,
    ERC725Account,
    ERC734KeyManager | undefined
  ]) => {
    let action;
    if (keyManagerContract) {
      action = keyManagerContract.execute(
        accountContract.interface.encodeFunctionData('setDataWithArray', [keyValuePairs])
      );
    } else {
      action = accountContract.setDataWithArray(keyValuePairs);
    }

    this.loadingIndicatorService.addPromise({
      promise: action,
      type: PendingTransactionType.Profile,
      action: 'Saving Profile',
      callBack: () => {
        this.router.navigate(['../keys'], { relativeTo: this.route });
      },
    });
  };
}
