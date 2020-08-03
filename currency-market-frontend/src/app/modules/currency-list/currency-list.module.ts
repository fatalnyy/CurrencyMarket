import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyListComponent } from './currency-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CurrencyListComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule
  ],
  exports: [CurrencyListComponent]
})
export class CurrencyListModule { }
