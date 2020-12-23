import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { Erc725Component } from './account.component';
import { OverviewAccountComponent } from './overview/overview-account/overview-account.component';
import { AssetListItemComponent } from './overview/overview-assets/asset-list-item/asset-list-item.component';
import { OverviewAssetsComponent } from './overview/overview-assets/overview-assets.component';
import { OverviewClaimsComponent } from './overview/overview-claims/overview-claims.component';
import { OverviewTokensComponent } from './overview/overview-tokens/overview-tokens.component';
import { OverviewWalletComponent } from './overview/overview-wallet/overview-wallet.component';
import { OverviewComponent } from './overview/overview.component';
import { LockButtonComponent } from './smart-vault/lock-button/lock-button.component';
import { WithdrawButtonComponent } from './smart-vault/withdraw-button/withdraw-button.component';
import { QrCodeComponent } from './wallet/qr-code/qr-code.component';
import { WalletComponent } from './wallet/wallet.component';
import { ManagementGuard } from '@shared/guards/management.guard';

const routes: Routes = [
  {
    path: ':address',
    component: OverviewComponent,
  },
  {
    path: ':address/wallet',
    component: OverviewWalletComponent,
  },
  {
    path: ':address',
    loadChildren: () =>
      import('../account-editor/account-editor.module').then((m) => m.AccountEditorModule),
  },
];

@NgModule({
  declarations: [
    Erc725Component,
    LockButtonComponent,
    WithdrawButtonComponent,
    WalletComponent,
    OverviewComponent,
    OverviewTokensComponent,
    OverviewAssetsComponent,
    OverviewWalletComponent,
    OverviewClaimsComponent,
    OverviewAccountComponent,
    QrCodeComponent,
    AssetListItemComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule],
})
export class AccountModule {}
