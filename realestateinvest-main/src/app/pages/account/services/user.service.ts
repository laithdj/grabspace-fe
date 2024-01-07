import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseurl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  createUser(createUserData: any): any {
    return this.http.post(`${ baseurl }/users`, createUserData);
  }

  login(loginData: any): any {
    return this.http.post(`${ baseurl }/auth/login`, loginData);
  }

  updateUser(userId: string, updateUserData: any): any {
    return this.http.put(`${ baseurl }/users/${userId}`, updateUserData);
  }
  getUserById(userId: string): any {
    return this.http.get(`${ baseurl }/users/${userId}`);
  }

}
