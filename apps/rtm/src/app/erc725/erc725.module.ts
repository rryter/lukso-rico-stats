import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Erc725Component } from './erc725.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyManagerComponent } from './key-manager/key-manager.component';
import { SmartVaultComponent } from './smart-vault/smart-vault.component';
import { LockButtonComponent } from './smart-vault/lock-button/lock-button.component';
import { WithdrawButtonComponent } from './smart-vault/withdraw-button/withdraw-button.component';
import { ProxyAccountComponent } from './proxy-account/proxy-account.component';
import { ProgressComponent } from './progress/progress.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { LoadingComponent } from './loading/loading.component';
import { AddKeyComponent } from './key-manager/add-key/add-key.component';
import { PriviligesComponent } from './key-manager/priviliges/priviliges.component';

const routes: Routes = [
  { path: '', component: NewAccountComponent },
  { path: 'create-wallet', component: NewAccountComponent },
  {
    path: 'accounts/:address',
    component: Erc725Component,
  },
];

@NgModule({
  declarations: [
    Erc725Component,
    KeyManagerComponent,
    SmartVaultComponent,
    LockButtonComponent,
    WithdrawButtonComponent,
    ProxyAccountComponent,
    ProgressComponent,
    NewAccountComponent,
    LoadingComponent,
    AddKeyComponent,
    PriviligesComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule],
})
export class Erc725Module {}
