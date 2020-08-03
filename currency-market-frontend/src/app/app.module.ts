import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MDBBootstrapModule, ModalContainerComponent } from 'angular-bootstrap-md';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RegisterModule } from './modules/register/register.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginModule } from './modules/login/login.module';
import { Interceptor } from './core/interceptors/http-interceptor.interceptor';
import { CurrencyListModule } from './modules/currency-list/currency-list.module';
import { HomeModule } from './modules/home/home.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ToastrModule } from 'ngx-toastr';
import {MyAccountModule} from './modules/my-account/my-account.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    DashboardModule,
    RegisterModule,
    LoginModule,
    CurrencyListModule,
    CurrencyModule,
    MyAccountModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    HomeModule,
    WalletModule,
    ToastrModule.forRoot()
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
