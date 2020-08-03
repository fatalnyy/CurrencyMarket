import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
import { WalletHistory } from 'src/app/shared/models/wallet-history.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletHistoryService {

  constructor(private readonly http: HttpClient) { }

  getWalletHistory(username: string, currency: string): Observable<WalletHistory[]> {
    const params = new HttpParams()
      .set('username', username)
      .set('currency', currency);
    return this.http.get<WalletHistory[]>(`${environment.walletHistoryAPI}/getWalletHistory`, {params});
  }

  addWalletHistory(walletHistory: WalletHistory): Observable<WalletHistory> {
    return this.http.post<WalletHistory>(`${environment.walletHistoryAPI}/addWalletHistory`, walletHistory);
  }
}
