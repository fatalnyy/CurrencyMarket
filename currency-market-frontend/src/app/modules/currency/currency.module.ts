import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency.component';
import { SellCurrencyComponent } from './sell-currency/sell-currency.component';
import { BuyCurrencyComponent } from './buy-currency/buy-currency.component';
import { TableModule, WavesModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CurrencyComponent, SellCurrencyComponent, BuyCurrencyComponent],
  imports: [
    CommonModule,
    TableModule,
    WavesModule,
    FormsModule
  ],
  exports: [CurrencyComponent]
})
export class CurrencyModule { }
