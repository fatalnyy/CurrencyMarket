import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../shared/models/transaction.interface';
import { TransactionType } from 'src/app/helpers/enums/transaction-type.enum';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private readonly http: HttpClient) { }

  getTransactionsByUsername(username: string): Observable<Transaction[]> {
    const params = new HttpParams()
    .set('username', username);

    return this.http.get<Transaction[]>(`${environment.transactionsAPI}/getTransactions`, {params});
  }

  getTransactionsByType(username: string, type: string): Observable<Transaction[]> {
    const params = new HttpParams()
    .set('username', username)
    .set('type', type);
    
    return this.http.get<Transaction[]>(`${environment.transactionsAPI}/getTransactionsType`, {params});
  }

  getWalletTransactions(username: string, walletCurrency: string): Observable<Transaction[]> {
    const params = new HttpParams()
    .set('username', username)
    .set('code', walletCurrency);

    return this.http.get<Transaction[]>(`${environment.transactionsAPI}/getWalletTransactions`, {params});
  }

  fetchAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${environment.transactionsAPI}/fetchAll`);
  }

  makeTransaction(transactionJson: any): Observable<Transaction> {
    return this.http.post<any>(`${environment.transactionsAPI}/makeTransaction`, transactionJson);
  }
}
