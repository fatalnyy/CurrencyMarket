import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wallet } from '../../shared/models/wallet.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private readonly http: HttpClient) { }

  getWallets(username: string): Observable<Wallet[]> {
    const params = new HttpParams()
      .set('username', username);
    return this.http.get<Wallet[]>(`${environment.walletAPI}/getWallets`, {params});
  }

  getWallet(username: string, currency: string): Observable<Wallet> {
    const params = new HttpParams()
      .set('username', username)
      .set('currency', currency);
    return this.http.get<Wallet>(`${environment.walletAPI}/getWallet`, {params});
  }

  addWallet(walletJson: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(`${environment.walletAPI}/addWallet`, walletJson);
  }
}
