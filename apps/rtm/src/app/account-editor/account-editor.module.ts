import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountEditorComponent } from './account-editor.component';
import { SharedModule } from '@shared/shared.module';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { KeyEditorComponent } from './key-editor/key-editor.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Erc725ExplainerComponent } from './erc725-explainer/erc725-explainer.component';

const routes: Routes = [
  {
    path: ':address',
    component: AccountEditorComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account',
      },
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
  ],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, SharedModule],
})
export class AccountEditorModule {}
