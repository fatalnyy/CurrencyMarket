import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserLogin } from '../../shared/models/userLogin.interface';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient, private readonly router: Router) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.userAPI}/register`, user);
  }

  login(user: UserLogin): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${environment.userAPI}/login`, user);
  }

  getCurrencyMarketUser(): Observable<User> {
    return this.http.get<User>(`${environment.userAPI}/getCurrencyMarketUser`);
  }

  saveToken(token: string): void {
    window.localStorage.setItem('auth-token', token);
  }

  saveUser(user: User): void {
    window.localStorage.setItem('user-info', JSON.stringify(user));
  }

  getToken(): string {
    return window.localStorage.getItem('auth-token');
  }

  getUser(): User {
    return JSON.parse(window.localStorage.getItem('user-info'));
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (token) {
      this.isUserLoggedIn.next(true);
    }
    return this.isUserLoggedIn.asObservable();
  }

  logout(): void {
    this.isUserLoggedIn.next(false);
    window.localStorage.removeItem('auth-token');
    this.router.navigate(['/list']);
  }
}

