import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Transaction } from './models/transaction.model';
import { InjectModel } from '@nestjs/mongoose';
import { InstanceType, ModelType } from 'typegoose';
import { TransactionVm } from './models/view-models/transaction-vm.model';
import { TransactionType } from './models/transactions.enum';
import { WalletService } from '../wallet/wallet.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { WalletHistoryService } from '../wallet-history/wallet-history.service';
import { WalletHistoryVm } from '../wallet-history/models/wallet-history-vm.model';

@Injectable()
export class TransactionsService extends BaseService<Transaction> {
    constructor(
        private readonly http: HttpService,
        private readonly walletService: WalletService,
        private readonly currenciesService: CurrenciesService,
        private readonly walletHistoryService: WalletHistoryService,
        @InjectModel(Transaction.modelName) private readonly _transactionModel: ModelType<Transaction>, ) {
        super();
        this._model = _transactionModel;
      }

      async getAll(): Promise<InstanceType<Transaction>[]>{
        return await this.findAll();
      }

      async getTransactions(username: string): Promise<InstanceType<Transaction>[]> {
        let transactions = await this.findAll({username});
        transactions = transactions.sort(function(a: Transaction, b: Transaction) { return b.createdAt.getTime() - a.createdAt.getTime()});

        return transactions;
      }

      async getTransactionsType(username: string, type: string): Promise<InstanceType<Transaction>[]> {
        return await this.findAll({username: username, type: type});
      }

      async getWalletTransactions(username: string, walletCurrency: string): Promise<InstanceType<Transaction>[]> {
        let userTransactions = await this.getTransactions(username);
        let walletTransactions = userTransactions.filter(p => p.name.includes(walletCurrency));
        walletTransactions = walletTransactions.sort(function(a: Transaction, b: Transaction) { return b.createdAt.getTime() - a.createdAt.getTime()})
        
        return walletTransactions;
      }

      async getManageWalletTransactions(username: string, walletCurrency: string): Promise<InstanceType<Transaction>[]> {
        let walletTransactions = (await this.findAll({username: username,})).filter(p => p.name.includes(walletCurrency) && p.type.includes("Wallet"));
        walletTransactions = walletTransactions.sort(function(a: Transaction, b: Transaction) { return b.createdAt.getTime() - a.createdAt.getTime()});
        
        return walletTransactions;
      }

      async saveTransaction(vm: TransactionVm){
        const { name, type, exchange, amount, username } = vm;
        const newTransaction = Transaction.createModel();

        newTransaction.name = name;
        newTransaction.type = type

        if (exchange)
          newTransaction.exchange = Number(exchange);

        newTransaction.amount = Number(amount);
        newTransaction.username = username;
        newTransaction.createdAt = new Date();
        newTransaction.updatedAt = new Date();

        try{
           const result = await this.create(newTransaction);
           return result.toJSON() as Transaction;
        }catch (e){
          throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      async makeTransaction(vm: TransactionVm): Promise<Transaction>{
      
        try{

          const { name, exchange, amount, username, currency, ownedCurrency, obtainedCurrency, type } = vm;
          let walletHistory: WalletHistoryVm;
          switch (vm.type){
            case TransactionType.CurrencyExchange:

              if (!ownedCurrency || !obtainedCurrency) break;
                  
              let currencyMarketUsername = "currencymarket";
              let ownedAmount: number = Number(amount);
  
              let ownedCurrencyInfo = await this.currenciesService.getLatestCurrency(ownedCurrency);
              let obtainedCurrencyInfo = await this.currenciesService.getLatestCurrency(obtainedCurrency);
  
              let obtainedCurrencyWallet = await this.walletService.getWallet(username, obtainedCurrency);
              let ownedCurrencyWallet = await this.walletService.getWallet(username, ownedCurrency);
  
              let currencyMarketWalletIn = await this.walletService.getWallet(currencyMarketUsername, ownedCurrency);
              let currencyMarketWalletOut = await this.walletService.getWallet(currencyMarketUsername, obtainedCurrency);
  
              if (ownedCurrencyWallet.amount < ownedAmount){
                //TODO
                break;
              }
  
              let exchangeCurrency: number = (ownedCurrencyInfo.bid > obtainedCurrencyInfo.bid) ?
                ownedCurrencyInfo.bid / obtainedCurrencyInfo.bid : ownedCurrencyInfo.ask / obtainedCurrencyInfo.ask;
  
              exchangeCurrency = Number(exchangeCurrency.toFixed(4));
              let obtainedAmount: number = ownedAmount * exchangeCurrency;            
              vm.name = "Transakcja wymiany waluty " + ownedCurrency + " na " + obtainedCurrency;               
              vm.exchange = String(exchangeCurrency);
  
              ownedCurrencyWallet.amount -= ownedAmount;
              currencyMarketWalletIn.amount += ownedAmount;
              currencyMarketWalletOut.amount -= obtainedAmount;
              obtainedCurrencyWallet.amount += obtainedAmount;
              
              await this.walletService.updateWallet(ownedCurrencyWallet);
              await this.walletService.updateWallet(currencyMarketWalletIn);
              await this.walletService.updateWallet(currencyMarketWalletOut);
              await this.walletService.updateWallet(obtainedCurrencyWallet);
             
              walletHistory = {'username': currencyMarketUsername, 'currency': currencyMarketWalletIn.currency, 'amount': currencyMarketWalletIn.amount.toString(), 'name': currencyMarketWalletIn.name};
              await this.walletHistoryService.addWalletHistory(walletHistory);
              walletHistory = {'username': currencyMarketUsername, 'currency': currencyMarketWalletOut.currency, 'amount': currencyMarketWalletOut.amount.toString(), 'name': currencyMarketWalletOut.name};
              await this.walletHistoryService.addWalletHistory(walletHistory);
              walletHistory = {'username': username, 'currency': obtainedCurrencyWallet.currency, 'amount': obtainedCurrencyWallet.amount.toString(), 'name': obtainedCurrencyWallet.name};
              await this.walletHistoryService.addWalletHistory(walletHistory);
              walletHistory = {'username': username, 'currency': ownedCurrencyWallet.currency, 'amount': ownedCurrencyWallet.amount.toString(), 'name': ownedCurrencyWallet.name};
              await this.walletHistoryService.addWalletHistory(walletHistory);

              break;
  
              case TransactionType.WalletBoost:
              case TransactionType.WalletWithdraw:
  
                let wallet = await this.walletService.findOne({ username, currency});

                if (type == TransactionType.WalletBoost){
                  wallet.amount += Number(amount);
                  vm.name = "Zasilenie portfela " + wallet.name;
                }else if (type == TransactionType.WalletWithdraw){
                  wallet.amount -= Number(amount);
                  vm.name = "Wypłata środków z portfela " + wallet.name;
                }

                await this.walletService.update(wallet.id, wallet);

                walletHistory = {'username': username, 'currency': currency, 'amount': wallet.amount.toString(), 'name': wallet.name};
                await this.walletHistoryService.addWalletHistory(walletHistory);
                break;
          }
          
          let result = await this.saveTransaction(vm);
          //result = transaction ? JSON.stringify("Transakcja przebiegła pomyślnie") : JSON.stringify("Coś poszło nie tak");
  
          return result;
        }
        catch (e){
          throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
      }
}