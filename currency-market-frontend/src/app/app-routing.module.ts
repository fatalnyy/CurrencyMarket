import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { CurrencyListComponent } from './modules/currency-list/currency-list.component';
import { HomeComponent } from './modules/home/home.component';
import { CurrencyComponent } from './modules/currency/currency.component';
import { WalletComponent } from './modules/wallet/wallet.component';
import { WalletDetailComponent } from './modules/wallet/wallet-detail/wallet-detail.component';
import {MyAccountComponent} from './modules/my-account/my-account.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', component: CurrencyListComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'list', component: CurrencyListComponent},
  { path: 'currency/:code', component: CurrencyComponent},
  { path: 'wallets', component: WalletComponent},
  { path: 'wallets/:username/:currency', component: WalletDetailComponent},
  { path: '', component: HomeComponent},
  { path: 'my-account', component: MyAccountComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
