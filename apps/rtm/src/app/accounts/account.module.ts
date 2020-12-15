import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Erc725Component } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LockButtonComponent } from './smart-vault/lock-button/lock-button.component';
import { WithdrawButtonComponent } from './smart-vault/withdraw-button/withdraw-button.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProgressComponent } from './progress/progress.component';
import { OverviewComponent } from './overview/overview.component';
import { OverviewTokensComponent } from './overview/overview-tokens/overview-tokens.component';
import { OverviewAssetsComponent } from './overview/overview-assets/overview-assets.component';
import { OverviewWalletComponent } from './overview/overview-wallet/overview-wallet.component';
import { OverviewClaimsComponent } from './overview/overview-claims/overview-claims.component';
import { OverviewAccountComponent } from './overview/overview-account/overview-account.component';
import { AccountComponent } from './account/account.component';
import { KeyValueInfosComponent } from './account/key-value-infos/key-value-infos.component';
import { EditPublicDataComponent } from './account/key-value-infos/edit-public-data/edit-public-data..component';
import { ManagementGuard } from '@shared/guards/management.guard';
import { QrCodeComponent } from './wallet/qr-code/qr-code.component';
import { AssetListItemComponent } from './overview/overview-assets/asset-list-item/asset-list-item.component';

const routes: Routes = [
  {
    path: ':address',
    component: OverviewComponent,
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
    ProgressComponent,
    OverviewComponent,
    OverviewTokensComponent,
    OverviewAssetsComponent,
    OverviewWalletComponent,
    OverviewClaimsComponent,
    OverviewAccountComponent,
    AccountComponent,
    KeyValueInfosComponent,
    EditPublicDataComponent,
    QrCodeComponent,
    AssetListItemComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule],
})
export class AccountModule {}
