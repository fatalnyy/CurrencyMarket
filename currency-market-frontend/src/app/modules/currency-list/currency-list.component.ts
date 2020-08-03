import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Currency } from '../../shared/models/currencies.interface';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { CurrenciesService } from '../../core/services/currencies.service';
import { BehaviorSubject, Subscription, interval} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { WalletService } from 'src/app/core/services/wallet.service';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit, AfterViewInit {
  currencies$ = new BehaviorSubject<Currency[]>([]);
  previous: Currency[] = [];
  currencyInfoDisplay = ['name', 'code', 'bid', 'ask'];
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  constructor(private readonly currenciesService: CurrenciesService, private cdRef: ChangeDetectorRef,
                private readonly authService: AuthService,
                private readonly walletService: WalletService) { }

  ngOnInit() {
     this.currenciesService.getLatestCurrencies().subscribe(response => {
       this.currencies$.next(response);
       this.mdbTable.setDataSource(response);
       this.previous = response;
    });

    this.checkCurrencyMarketUserExistance();
    
    this.saveCurrencies();
    interval(900000).subscribe(x =>{
      this.saveCurrencies();
    })

  }

  ngAfterViewInit(): void {
      this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
      this.cdRef.detectChanges();
  }

  saveCurrencies() {
    this.currenciesService.saveAllCurrencies().subscribe(response => {
   });
  }

  checkCurrencyMarketUserExistance() {
   this.authService.getCurrencyMarketUser().subscribe(currencyMarketUser =>{
    if (currencyMarketUser) return;

    const currencyMarketUserJson = {'username': "currencymarket", 'password': "password", 'passwordConfirmation': "password", 'role': "admin"};
    this.authService.register(currencyMarketUserJson).subscribe();

    let walletJson =  {'username': "currencymarket", 'currency': "USD", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "AUD", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "EUR", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "PLN", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "CAD", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "HUF", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "CHF", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "GBP", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "JPY", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "CZK", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "DKK", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "NOK", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "SEK", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
    walletJson = {'username': "currencymarket", 'currency': "XDR", 'amount': 1000000000};
    this.walletService.addWallet(walletJson).subscribe();
   })    
  }
}
