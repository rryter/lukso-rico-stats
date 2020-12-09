import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./new-account/new-account.module').then((m) => m.NewAccountModule),
        },
        {
          path: 'accounts',
          loadChildren: () => import('./accounts/account.module').then((m) => m.AccountModule),
        },
        {
          path: 'sign-up',
          loadChildren: () =>
            import('./account-editor/account-editor.module').then((m) => m.AccountEditorModule),
        },
      ],
      { initialNavigation: 'enabled', enableTracing: false }
    ),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
