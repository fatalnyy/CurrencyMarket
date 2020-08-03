import { Component, Input, OnInit } from '@angular/core';
import { Currency } from '../../../shared/models/currencies.interface';
import { Transaction } from '../../../shared/models/transaction.interface';
import { CurrenciesService } from '../../../core/services/currencies.service';
import { TransactionsService } from '../../../core/services/transactions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../../../core/validators/password.validator';
import { TransactionType } from '../../../helpers/enums/transaction-type.enum';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-currency',
  templateUrl: './buy-currency.component.html',
  styleUrls: ['./buy-currency.component.scss']
})
export class BuyCurrencyComponent implements OnInit {
  @Input() currency: Currency;
  uniqueCurrencies: string[];
  currencyToPayAmount: number = 0;
  currencyToBuyAmount : number = 0;
  currentTransaction: Transaction = {
  currency: '',
  type: TransactionType.CurrencyExchange,
  exchange: 0,
  amount: 0,
  username: this.authService.getUser().username,
  ownedCurrency: '',
  obtainedCurrency: ''
  };
  currencyToPay: string = '';

  constructor(private readonly currenciesService: CurrenciesService, private readonly transactionService: TransactionsService, private readonly authService: AuthService, private readonly toastr: ToastrService, private readonly router: Router) { }

  ngOnInit() {
    this.currenciesService.getUniqueCurrencies().subscribe(response =>{
      this.uniqueCurrencies = response;
    })
  }

  onBack(): void {
    this.currenciesService.transactionState.next(0);
  }

  countCurrencyToPayAmount(currencyToPayCode: string): void {
    this.currentTransaction.ownedCurrency = currencyToPayCode;
    this.currenciesService.getLatestCurrency(currencyToPayCode).subscribe(response => {
      this.currencyToPayAmount = this.currencyToBuyAmount * this.currency.ask / response.bid;
    });
  }

  buyCurrency(): void {
    this.currentTransaction.ownedCurrency = this.currencyToPay;
    this.currentTransaction.obtainedCurrency = this.currency.code;
    this.currentTransaction.amount = Number(this.currencyToPayAmount.toPrecision(4));
    this.transactionService.makeTransaction(this.currentTransaction).subscribe(response => {
      this.toastr.success('Z sukcesem kupiłeś walutę!', 'Sukces!');
      this.router.navigate(['/my-account']);
    }, error => {
      this.toastr.error(error.error.message, "Mamy problem!");
    });
  }

}
