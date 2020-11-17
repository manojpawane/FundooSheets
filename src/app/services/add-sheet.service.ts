import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpServiceService } from './http-service.service';

import { HttpHeaders , HttpClient} from '@angular/common/http';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Headers', '*')
};
@Injectable({
  providedIn: 'root'
})
export class AddSheetService {

  constructor(private http: HttpClient, private httpServices: HttpServiceService) { }

  addSheet() {
    console.log('add project services');
    // return this.http.get('../../assets/data/fundooSheet.json');
    return this.http.get('../assets/data/fundooSheet.json');
  }
  sheet(sheet: any, projectId: any ) {
    return this.httpServices.postRequest2projects('/projects/' + projectId + '/sheets', sheet);

  }
// getSheet(projectId:any){
//   return this.httpServices.getReq('/projects/' + projectId + '/sheets');
// }
getSheet(projectId) {
  const option = {
    url: '/projects/' + projectId + '/sheets',
  };
  return this.httpServices.getReq(option);
}
getsheetsFields(projectId, sheetId) {
  const option = {
    url: '/projects/' + projectId + '/sheets/' + sheetId,
  };
  return this.httpServices.getReq(option);
  // projects/5d5bf1946287ad00182ddde9/sheets/5d5cefb36287ad00182dddf9
}


deleteSheet(projectId, sheetId) {
  const option = {
    url: '/projects/' + projectId + '/sheets/' + sheetId,
  };
  return this.httpServices.deleteReq(option);
}
addfields(projectId, sheetId, fields: any) {
  const options = {
    url: '/projects/' + projectId + '/sheets/' + sheetId + '/field',
    data: fields
  };
  return this.httpServices.postReq(options);
}
editheader(projectId, sheetId, fieldId,fields: any) {
  let options = {
    url: '/projects/' + projectId + '/sheets/' + sheetId + '/field/'+fieldId,
    // /projects/{projectId}/sheets/{sheetId}/field/{fieldId}
    data: fields
  };
  return this.httpServices.putReq(options);
}
deleteheader(projectId,sheetId,fieldId){
  let options={
    url: '/projects/' + projectId + '/sheets/' + sheetId + '/field/'+fieldId
  };
  return this.httpServices.deleteReq(options)

}

}
