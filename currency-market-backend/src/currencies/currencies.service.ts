import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Currency } from './models/currency.model';
import { InjectModel } from '@nestjs/mongoose';
import { InstanceType, ModelType } from 'typegoose';
import { JsonWebTokenError } from 'jsonwebtoken';
import { resolve } from 'dns';
import { Observable } from 'rxjs';

@Injectable()
export class CurrenciesService extends BaseService<Currency> {
  private currentCurrenciesUrl: string = 'http://api.nbp.pl/api/exchangerates/tables/C/last/1';
  constructor(
    private readonly http: HttpService,
    @InjectModel(Currency.modelName) private readonly _currencyModel: ModelType<Currency>) {
    super();
    this._model = _currencyModel;
  }

  async saveCurrencies() {
    let currenciesToSave = [];
    let plnCurrency = this.getPlnCurrency();

    await this.http.get(this.currentCurrenciesUrl).subscribe(async currencies => {
      try{
          currenciesToSave = currencies.data[0].rates;
          currenciesToSave.push(plnCurrency);
          currenciesToSave.forEach(async currencyToSave => {    

          const newCurrency = Currency.createModel();
          newCurrency.name = currencyToSave.currency;
          newCurrency.code = currencyToSave.code;
          newCurrency.bid = currencyToSave.bid;
          newCurrency.ask = currencyToSave.ask;
          newCurrency.createdAt = new Date();
          newCurrency.updatedAt = new Date();

          await this.create(newCurrency);
          });
        }catch (e) {
          throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });
  
  }

  async getCurrencyHistory(currency: string): Promise<InstanceType<Currency>[]>{
    return await this.findAll({code: currency});
  }
  
  async getCurrency(code: string): Promise<InstanceType<Currency>> {
    return await this.findOne({code});
  }

  async getAll(): Promise<InstanceType<Currency>[]> {
    return await this.findAll();
  }

  async getLatestCurrency(currency: string, isPreviousCurrencies = false): Promise<InstanceType<Currency>>{
    const latestCurrencies: InstanceType<Currency>[] = await this.getLatestCurrencies(isPreviousCurrencies);
    const latestCurrency = latestCurrencies.find(x=> x.code === currency);

    return latestCurrency;
  }

  async getLatestCurrencies(isPreviousCurrencies = false): Promise<InstanceType<Currency>[]>{
    let currencies: InstanceType<Currency>[] = await this.getAll();
    let uniqueCurrencies = [...new Set(currencies.map(x => x.name))];
    currencies = currencies.sort(function(a: Currency, b: Currency) { return b.createdAt.getTime() - a.createdAt.getTime()});

    let latestCurrencies = !isPreviousCurrencies ? currencies.slice(0, uniqueCurrencies.length) : currencies.slice(uniqueCurrencies.length, uniqueCurrencies.length * 2 );

    latestCurrencies = latestCurrencies.sort((a, b) => a.name.localeCompare(b.name));
    return latestCurrencies;
  }

  async getPeriodicCurrencies(currency: string, period: number): Promise<InstanceType<Currency>[]>{
    let currencies: InstanceType<Currency>[] = await this.getAll();
    let periodicDate: Date = new Date();
    periodicDate.setDate(periodicDate.getDate() - period);
    periodicDate = new Date(periodicDate.getFullYear(), periodicDate.getMonth(), periodicDate.getDate(), 0, 0, 0);
    let periodicCurrencies = currencies.filter(x => x.createdAt >= periodicDate);

    return periodicCurrencies; 
  }

  async getLatestToPreviousCurrencyRatio(currency: string){
    let isPreviousCurrency: boolean = true;
    let latestCurrency: InstanceType<Currency> = await this.getLatestCurrency(currency);
    let previousCurrency: InstanceType<Currency> = await this.getLatestCurrency(currency, isPreviousCurrency);
    
    let askRatio: number = latestCurrency.ask / previousCurrency.ask - 1;
    let bidRatio: number = latestCurrency.bid / previousCurrency.bid - 1;

    let isAskGrowth: boolean = askRatio >= 0 ? true : false;
    let isBidGrowth: boolean = bidRatio >= 0 ? true : false;

    return {
      askRatio,
      bidRatio,
      isAskGrowth,
      isBidGrowth
    }
  }

  async getMonthlyCurrencyArray(currency: string, month: number): Promise<InstanceType<Currency>[]>{
    let currencies: InstanceType<Currency>[]= await this.findAll();
    let currencyArray = currencies.filter(x => x.code === currency);
    let x= currencyArray[0].createdAt.getMonth();
    //TODO po wczytaniu danych historycznych można dodać warunek do filter -> x.createdAt.getHours() % 3 == 0 && x.createdAt.getMinutes() == 0, dane co 6 godzin o pełnej godzinie
    let monthlyCurrencies = currencyArray.filter(x => x.createdAt.getMonth() + 1 === Number(month));

    return monthlyCurrencies;
  }

  async getUniqueCurrencies(): Promise<string[]>{
    let currencies: InstanceType<Currency>[] = await this.getAll();
    let uniqueCurrencies = [...new Set(currencies.map(x => x.code))];

    return uniqueCurrencies;
  }

  getPlnCurrency(){

    let plnCurrency: string = '{' +
      '"currency": "złoty polski",' +
      '"code": "PLN",' + 
      '"bid": 1.0,' +
      '"ask": 1.0' +
     '}';

    return JSON.parse(plnCurrency);
  }

  async getDuplicatedCurrency(currencies: InstanceType<Currency>[], currencyToCheck: Currency): Promise<InstanceType<Currency>> {
    let duplicatedCurrency = null;
    currencies.forEach(currency => {
      if (currency.code === currencyToCheck.code) {
        duplicatedCurrency = currency;
      }
    });
    return duplicatedCurrency;
  }
}

