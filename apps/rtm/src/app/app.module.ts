import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RicoComponent } from './rico/rico.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ShortNumberPipe } from './shortnumber.pipe';
import { LargeBuysComponent } from './rico/large-buys/large-buys.component';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [RicoComponent, ShortNumberPipe, LargeBuysComponent, SpinnerComponent, AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () => import('./block-explorer/block-explorer.module').then((m) => m.BlockExplorerModule),
        },
      ],
      { initialNavigation: 'enabled' }
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
