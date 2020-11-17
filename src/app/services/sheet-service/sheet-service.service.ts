import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SheetServiceService {
  //baseurl = environment.userApi;
  baseurl2 = environment.sheetsApi;
  constructor(private http: HttpClient) { }
  public postRequest(url: any, data: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    };
    console.log("Url", this.baseurl2 + url);

    return this.http.post(this.baseurl2 + url, data, httpOptions);
  }

  // public putRequest(url: any, data: any): any {
  //   return this.http.put(this.baseurl2 + url, data);
  // }

  public deleteRequest(url: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    };
    return this.http.delete(this.baseurl2 + url, httpOptions);
  }

  public getRequest(url: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    };
    console.log("Url", this.baseurl2 + url);

    return this.http.get(this.baseurl2 + url, httpOptions);
  }
}
