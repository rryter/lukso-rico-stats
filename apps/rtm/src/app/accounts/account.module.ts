import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Erc725Component } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyManagerComponent } from './account/key-manager/key-manager.component';
import { LockButtonComponent } from './smart-vault/lock-button/lock-button.component';
import { WithdrawButtonComponent } from './smart-vault/withdraw-button/withdraw-button.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProgressComponent } from './progress/progress.component';
import { AddKeyComponent } from './account/key-manager/add-key/add-key.component';
import { PriviligesComponent } from './account/key-manager/priviliges/priviliges.component';
import { OverviewComponent } from './overview/overview.component';
import { OverviewTokensComponent } from './overview/overview-tokens/overview-tokens.component';
import { OverviewAssetsComponent } from './overview/overview-assets/overview-assets.component';
import { OverviewWalletComponent } from './overview/overview-wallet/overview-wallet.component';
import { OverviewClaimsComponent } from './overview/overview-claims/overview-claims.component';
import { OverviewAccountComponent } from './overview/overview-account/overview-account.component';
import { AccountComponent } from './account/account.component';
import { KeyValueInfosComponent } from './account/key-value-infos/key-value-infos.component';

const routes: Routes = [
  {
    path: ':address',
    component: OverviewComponent,
  },
  {
    path: ':address/account',
    component: AccountComponent,
  },
];

@NgModule({
  declarations: [
    Erc725Component,
    KeyManagerComponent,
    LockButtonComponent,
    WithdrawButtonComponent,
    WalletComponent,
    ProgressComponent,
    AddKeyComponent,
    PriviligesComponent,
    OverviewComponent,
    OverviewTokensComponent,
    OverviewAssetsComponent,
    OverviewWalletComponent,
    OverviewClaimsComponent,
    OverviewAccountComponent,
    AccountComponent,
    KeyValueInfosComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule],
})
export class AccountModule {}
