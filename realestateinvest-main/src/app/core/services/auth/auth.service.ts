import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseurl } from './../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface LoggedInUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  email: string;
}

export const tokenTypes = {
  ACCESS: 'AUTH',
  REFRESH: 'REAUTH',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: LoggedInUser | null;
  loginState = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient) {
    const storedUser = localStorage.getItem('details');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
  login(params: any): any {
    return this.httpClient.post(`${baseurl}/auth/login`, params);
  }
  logout(): any {
    return this.httpClient.post(`${baseurl}/auth/logout`, { refreshToken: this.getToken(tokenTypes.REFRESH) });
  }
  createToken(userData: LoggedInUser, accessToken: {token: string, expires: string}, refreshToken: {token: string, expires: string}) {
    localStorage.setItem('details', JSON.stringify(userData));
    this.setUser(userData);
    this.saveToken(tokenTypes.ACCESS, accessToken.token);
    this.saveToken(tokenTypes.REFRESH, refreshToken.token);
    this.loginState.next(true);
    return userData;
  }
  removeUser() {
    this.removeToken(tokenTypes.ACCESS);
    this.removeToken(tokenTypes.REFRESH);
    this.setUser(null);
    this.loginState.next(false);
  }
  

  isLoggedIn() {
    return this.user ? true : false;
  }
  saveToken(name: string, token: string) {
    localStorage.setItem(name, token);
  }

  setUser(user: LoggedInUser | null) {
    this.user = user;
  }
  getUser() {
    return this.user || null;
  }

  getToken(name: string) {
    return localStorage.getItem(name);
  }

  refreshToken() {
    return this.httpClient.post(`${baseurl}/auth/refresh-tokens`, {
      refreshToken: this.getToken(tokenTypes.REFRESH),
    });
  }

  

  removeToken(name: string) {
    localStorage.removeItem(name);
    localStorage.removeItem("details");
  }

  loadUserDetails() {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${baseurl}/users/getUserDetails`).subscribe({
        next: (user: any) => {
          this.user = user;
          resolve(true);
        },
        error: (err) => {
          resolve(true);
        },
      });
    });
  }


}