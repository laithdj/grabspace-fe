import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, catchError, switchMap, take, filter } from 'rxjs';
import { AuthService, tokenTypes } from '@services/auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  refresh = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    true
  );
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<Object>> {
    let authReq = this.addTokenHeader(req);

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes('auth/login') &&
          !authReq.url.includes('auth/refresh-tokens') &&
          error.status === 401
        ) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken(tokenTypes.REFRESH);
    if (!this.refresh && token) {
      this.refresh = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          // updating new token
          this.refresh = false;
          this.authService.saveToken(tokenTypes.ACCESS, res.access.token);
          this.authService.saveToken(tokenTypes.REFRESH, res.refresh.token);
          this.refreshTokenSubject.next(res.access.token);
          return next.handle(this.addTokenHeader(request));
        }),
        catchError((err) => {
          // removing old tokens and removing user
          if(err instanceof HttpErrorResponse && err.status===401){
            console.log(err);
            this.authService.removeToken(tokenTypes.ACCESS);
            this.authService.removeToken(tokenTypes.REFRESH);
            this.authService.setUser(null);
          }          
          this.refresh=false;
          this.refreshTokenSubject.next(true);
          return throwError(() => err);
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken(tokenTypes.ACCESS)}`,
      },
    });
  }
}

