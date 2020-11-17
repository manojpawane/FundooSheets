import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class AddProjectService {

  constructor(private httpService: HttpServiceService) { }

  addProject(data) {
    const option = {
      url: '/projects',
      data
    };
    console.log('add prject service :::::::', option);
    return this.httpService.postReq(option);
  }

  getProject() {
    const option = {
      url: '/projects',
    };
    return this.httpService.getReq(option);
  }

  getParticularProject(projectId) {
    const option = {
      url: '/projects/' + projectId + '/sheets',
    };
    return this.httpService.getReq(option);
  }


}
