import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('auth-token') != null) {
      const token = localStorage.getItem('auth-token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token} `);
      const AuthRequest = request.clone({headers: headers});
      return next.handle(AuthRequest).pipe(retry(1), catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.isUserLoggedIn.next(false);
          window.localStorage.removeItem('auth-token');
          this.router.navigate(['/']);
          return throwError(401);
        }
      }));
    } else {
      return next.handle(request);
    }
  }
}
