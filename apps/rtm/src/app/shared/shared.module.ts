import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { EthAddressShortPipe } from './pipes/eth-address-short.pipe';
import { CmcPricePipe } from './pipes/cmc-price.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from './components/dialog/confirm/confirm.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LayoutModule } from '@angular/cdk/layout';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';

const materialModules = [
  MatTableModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatMenuModule,
  MatListModule,
  MatCardModule,
  MatGridListModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
];
@NgModule({
  declarations: [TimeAgoPipe, EthAddressShortPipe, CmcPricePipe, ConfirmComponent, LayoutComponent],
  imports: [
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    ...materialModules,
  ],
  exports: [
    TimeAgoPipe,
    EthAddressShortPipe,
    CmcPricePipe,
    ConfirmComponent,
    LayoutComponent,
    ...materialModules,
  ],
})
export class SharedModule {}
