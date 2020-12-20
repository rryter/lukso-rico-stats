import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contracts } from '@shared/interface/contracts';
import { ContractService } from '@shared/services/contract.service';
import { utils } from 'ethers';
import { Observable, Subject } from 'rxjs';
import { pluck, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';

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
export class ProfileEditorComponent implements OnInit, OnChanges {
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
    private contractService: ContractService
  ) {
    this.form = this.fb.group(
      {
        image: [this.profile.image],
        nickName: [this.profile.nickName, [Validators.required]],
        bio: [this.profile.bio, [Validators.required]],
      },
      { updateOn: 'change' }
    );

    if (!this.route.parent) {
      throw Error('Parent not available');
    }
    this.contracts$ = this.route.parent.params.pipe(
      switchMap((params) => {
        console.log(params);
        return this.contractService.getContractsAndData(params.address);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.uploadedImage = this.router.getCurrentNavigation()?.extras.state?.imagePath;
  }

  ngOnInit() {
    this.contracts$.subscribe(({ accountData }) => {
      this.form.setValue(accountData);
    });

    this.saveTrigger$
      .pipe(withLatestFrom(this.contracts$))
      .subscribe(this.contractService.updateProfile);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.form.setValue(changes.data.currentValue);
    }
  }

  submit(form: FormGroup) {
    if (this.uploadedImage) {
      form.controls['image'].setValue(this.uploadedImage);
      form.markAsDirty();
    }

    if (form.valid && form.dirty) {
      const keyValuePairs = Object.entries(form.value).map((data: [string, any]) => {
        return { key: utils.formatBytes32String(data[0]), value: utils.toUtf8Bytes(data[1]) };
      });

      this.saveTrigger$.next(keyValuePairs);
    }
    this.router.navigate(['../keys'], { relativeTo: this.route });
  }

  back() {
    this.router.navigate(['../image'], { relativeTo: this.route });
  }
}
