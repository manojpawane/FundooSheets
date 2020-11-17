import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardBoxService {

  constructor(private http: HttpClient,
              private httpService: HttpServiceService) { }



  getdashboardReport(projectId,sheetId) {
   const option = {
      url: '/projects/'+projectId+'/sheets/'+sheetId+'/report',
    };
    return this.httpService.getReq(option);
  }

  // getdashboard() {
  //   return this.http.get('../../assets/data/dashboard.json');
    
  //   console.log();
  //   }
}
