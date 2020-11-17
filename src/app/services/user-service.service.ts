import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpServiceService } from './http-service.service';
import { Login } from '../model/login.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Headers', '*')
};
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  baseurl = environment.userApi;
  constructor(private http: HttpServiceService) { }
  login(login: any) {
    return this.http.postRequest('/login', login);
  }
  register(register: any) {
    return this.http.postRequest('/register', register);
  }
  forgot(forgot: any) {
    return this.http.postRequest('/forgot', forgot);
  }
  resetpassword(reset: any) {
    return this.http.postRequest1('/reset', reset);
  }
}
