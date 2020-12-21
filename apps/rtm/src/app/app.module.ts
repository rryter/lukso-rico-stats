import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers } from './store/index';

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
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
