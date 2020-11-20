import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewAccountComponent } from './new-account.component';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [{ path: '', component: NewAccountComponent }];

@NgModule({
  declarations: [NewAccountComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class NewAccountModule {}
