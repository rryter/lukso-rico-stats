import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LayoutReducedComponent } from '@shared/components/layout/layout-reduced/layout-reduced.component';

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
          component: LayoutReducedComponent,
          loadChildren: () =>
            import('./new-account/new-account.module').then((m) => m.NewAccountModule),
        },
        {
          path: 'accounts',
          component: LayoutComponent,
          loadChildren: () => import('./accounts/account.module').then((m) => m.AccountModule),
        },
      ],
      { initialNavigation: 'enabled', enableTracing: false, relativeLinkResolution: 'legacy' }
    ),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
