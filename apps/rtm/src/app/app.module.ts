import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [SpinnerComponent, AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () => import('./erc725/erc725.module').then((m) => m.Erc725Module),
        },
      ],
      { initialNavigation: 'enabled' }
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
