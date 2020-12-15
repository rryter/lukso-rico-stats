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
import { Contracts } from '@shared/interface/contracts';
import { PendingTransactionType } from '@shared/interface/transactions';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { utils } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { pluck, withLatestFrom } from 'rxjs/operators';

export interface Profile {
  nickName: string;
  bio: string;
  image: string;
}

@Component({
  selector: 'lukso-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditorComponent implements OnInit {
  uploadedImage: string;
  contracts$: Observable<Contracts>;
  form: FormGroup;
  saveTrigger$ = new Subject<
    {
      key: string;
      value: Uint8Array;
    }[]
  >();
  @Output() saveing = new EventEmitter();
  @Input() profile: Profile = { nickName: '', bio: '', image: '' };
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.form = this.fb.group(
      {
        image: [this.profile.image],
        nickName: [this.profile.nickName, [Validators.required]],
        bio: [this.profile.bio, [Validators.required]],
      },
      { updateOn: 'change' }
    );

    this.contracts$ = this.route.parent!.data.pipe(pluck('contracts'));
    this.uploadedImage = this.router.getCurrentNavigation()?.extras.state?.imagePath;
  }

  ngOnInit() {
    this.contracts$.subscribe(({ accountData }) => {
      this.form.setValue(accountData);
    });
    this.saveTrigger$.pipe(withLatestFrom(this.contracts$)).subscribe(this.updateProfile);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.form.setValue(changes.data.currentValue);
    }
  }

  submit(form: FormGroup) {
    if (form.valid && form.dirty) {
      if (this.uploadedImage) {
        form.controls['image'].setValue(this.uploadedImage);
      }
      const keyValuePairs = Object.entries(form.value).map((data: [string, any]) => {
        return { key: utils.formatBytes32String(data[0]), value: utils.toUtf8Bytes(data[1]) };
      });

      this.saveTrigger$.next(keyValuePairs);
    } else {
      this.router.navigate(['../keys'], { relativeTo: this.route });
    }
  }

  back() {
    this.router.navigate(['../image'], { relativeTo: this.route });
  }

  private updateProfile = ([keyValuePairs, { accountContract, keyManagerContract }]: [
    any,
    Contracts
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
