import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BlockExplorerComponent } from './block-explorer.component';
import { SharedModule } from '../shared/shared.module';
import { LockButtonComponent } from './lock-button/lock-button.component';
import { WithdrawButtonComponent } from './withdraw-button/withdraw-button.component';

const routes: Routes = [{ path: '', component: BlockExplorerComponent }];

@NgModule({
  declarations: [BlockExplorerComponent, LockButtonComponent, WithdrawButtonComponent],
  providers: [],
  imports: [SharedModule, CommonModule, RouterModule.forChild(routes)],
})
export class BlockExplorerModule {}
