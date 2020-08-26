import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ShortNumberPipe } from './shortnumber.pipe';
import { LargeBuysComponent } from './rico/large-buys/large-buys.component';
import { TimeAgoPipe } from './shared/pipes/time-ago.pipe';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    ShortNumberPipe,
    LargeBuysComponent,
    SpinnerComponent,
    TimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [TimeAgoPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
