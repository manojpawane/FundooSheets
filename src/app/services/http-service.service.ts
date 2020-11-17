import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Headers', '*')
};

@Injectable({
  providedIn: 'root'
})

export class HttpServiceService {

  baseurl = environment.userApi;
  baseurl2 = environment.sheetsApi;

  constructor(private http: HttpClient) { }

  public postRequest(url: any, data: any): any {
    return this.http.post(this.baseurl + url, data);
  }

  public putRequest(url: any, data: any): any {
    return this.http.put(this.baseurl + url, data);
  }

  public deleteRequest(url: any): any {
    return this.http.delete(this.baseurl + url);
  }

  public getRequest(url: any): any {
    const httpOptions1 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.get(this.baseurl + url, httpOptions1);
  }

  public postRequest1(url: any, data: any): any {
    const httpOptions1 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.post(this.baseurl + url, data, httpOptions1);
  }

  public postReq(options): any {
    const httpOptions2 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.post(this.baseurl2 + options.url, options.data, httpOptions2);
  }

  public postRequest2projects(url: any, data: any): any {
    const httpOptions1 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.post(this.baseurl2 + url, data, httpOptions1);
  }

  public getReq(options): any {
    const httpOptions2 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.get(this.baseurl2 + options.url, httpOptions2);
  }

  public deleteReq(options): any {
    const httpOptions2 = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
    return this.http.delete(this.baseurl2 + options.url, httpOptions2);
  }

  public putReq(options): any {
    const httpOptions2 = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    };
    return this.http.put(this.baseurl2 + options.url, options.data, httpOptions2);
  }
}
