import { Component, Input, OnInit } from '@angular/core';
import { Currency } from '../../../shared/models/currencies.interface';
import { Transaction } from '../../../shared/models/transaction.interface';
import { CurrenciesService } from '../../../core/services/currencies.service';
import { TransactionsService } from '../../../core/services/transactions.service';
import { TransactionType } from '../../../helpers/enums/transaction-type.enum';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell-currency',
  templateUrl: './sell-currency.component.html',
  styleUrls: ['./sell-currency.component.scss']
})
export class SellCurrencyComponent implements OnInit {
  @Input() currency: Currency;
  currencyToSellAmount : number = 0;
  currencyToBuyAmount : number = 0;
  uniqueCurrencies: string[];
  currentTransaction: Transaction = {
    currency: '',
    type: TransactionType.CurrencyExchange,
    exchange: 0,
    amount: 0,
    username: this.authService.getUser().username,
    ownedCurrency: '',
    obtainedCurrency: ''
  };
  currencyToBuy: string = '';
  constructor(private readonly currenciesService: CurrenciesService, private readonly transactionService: TransactionsService, private readonly authService: AuthService, private readonly toastr: ToastrService, private readonly router: Router) { }

  ngOnInit() {
    this.currenciesService.getUniqueCurrencies().subscribe(response =>{
      this.uniqueCurrencies = response;
    })
  }

  countCurrencyToPayAmount(currencyToPayCode: string): void {
    this.currentTransaction.ownedCurrency = currencyToPayCode;
    this.currenciesService.getLatestCurrency(currencyToPayCode).subscribe(response => {
      this.currencyToBuyAmount = this.currencyToSellAmount * this.currency.bid / response.bid;
    });
  }

  onBack(): void {
    this.currenciesService.transactionState.next(0);
  }

  sellCurrency(): void {
    this.currentTransaction.ownedCurrency = this.currency.code;
    this.currentTransaction.obtainedCurrency = this.currencyToBuy;
    this.currentTransaction.amount = this.currencyToSellAmount;
    this.transactionService.makeTransaction(this.currentTransaction).subscribe(response => {
      this.toastr.success('Kupiłeś walute z sukcesem!', 'Sukces!');
      this.router.navigate(['/my-account']);
    }, error => {
      this.toastr.error(error.error.message, "Mamy problem!");
    });
  }
}
