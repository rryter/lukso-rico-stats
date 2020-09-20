import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SmartVaultComponent } from './smart-vault.component';
import { SharedModule } from '../shared/shared.module';
import { LockButtonComponent } from './lock-button/lock-button.component';
import { WithdrawButtonComponent } from './withdraw-button/withdraw-button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WrongNetworkComponent } from './wrong-network/wrong-network.component';

const routes: Routes = [{ path: '', component: SmartVaultComponent }];

@NgModule({
  declarations: [SmartVaultComponent, LockButtonComponent, WithdrawButtonComponent, WrongNetworkComponent],
  providers: [],
  imports: [SharedModule, ReactiveFormsModule, CommonModule, RouterModule.forChild(routes)],
})
export class SmartVaultModule {}
