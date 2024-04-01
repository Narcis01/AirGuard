import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl: string = "http://localhost:3000/api/v1/login";
  resetUrl: string = "http://localhost:3000/api/v1/reset";
  logoutUrl: string = "http://localhost:3000/api/v1/logout";

  constructor(private httpClient: HttpClient) { }
  /**
   * 
   * @param user - user that we want to login
   * @returns - jwt token
   */
  login(user: User): Observable<any>{
    return this.httpClient.post(this.loginUrl, user);
  }
  /**
   * 
   * @param token - jwt token
   */
  reset(token: string, addressId: String): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get(`${this.resetUrl}/${addressId}`, {headers});
  }
}
