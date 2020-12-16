import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ContractsResolver } from '@shared/resolver/contracts.resolver';
import { SharedModule } from '@shared/shared.module';
import { AccountEditorComponent } from './account-editor.component';
import { Erc725ExplainerComponent } from './erc725-explainer/erc725-explainer.component';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { KeyEditorComponent } from './key-editor/key-editor.component';
import { AddKeyComponent } from './key-manager/add-key/add-key.component';
import { KeyManagerComponent } from './key-manager/key-manager.component';
import { PriviligesComponent } from './key-manager/priviliges/priviliges.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
const routes: Routes = [
  {
    path: '',
    component: AccountEditorComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      contracts: ContractsResolver,
    },
    children: [
      { path: 'account', component: Erc725ExplainerComponent },
      { path: 'image', component: ImageEditorComponent },
      { path: 'profile', component: ProfileEditorComponent },
      { path: 'keys', component: KeyEditorComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AccountEditorComponent,
    ImageEditorComponent,
    KeyEditorComponent,
    ProfileEditorComponent,
    Erc725ExplainerComponent,
    KeyManagerComponent,
    PriviligesComponent,
    AddKeyComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, SharedModule],
})
export class AccountEditorModule {}
