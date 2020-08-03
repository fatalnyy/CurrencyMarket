import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Currency } from '../../shared/models/currencies.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  transactionState = new BehaviorSubject<number>(0);

  constructor(private readonly http: HttpClient) { }

  saveAllCurrencies(): Observable<void> {
    return this.http.post<void>(`${environment.currenciesAPI}/saveAll`, '');
  }

  fetchAllCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${environment.currenciesAPI}/fetchAll`);
  }

  getCurrency(code: string): Observable<Currency> {
    const params = new HttpParams()
      .set('code', code);
    return this.http.get<Currency>(`${environment.currenciesAPI}/getCurrency`, {params});
  }

  getLatestCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${environment.currenciesAPI}/getLatestCurrencies`);
  }

  getLatestCurrency(code: string): Observable<Currency> {
    const params = new HttpParams()
      .set('code', code);
    return this.http.get<Currency>(`${environment.currenciesAPI}/getLatestCurrency`, {params});
  }

  getUniqueCurrencies(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.currenciesAPI}/getUniqueCurrencies`);
  }

  getCurrencyHistory(code: string): Observable<Currency[]> {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get<Currency[]>(`${environment.currenciesAPI}/getCurrencyHistory`, {params});
  }
}
