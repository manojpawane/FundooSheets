import { TestBed } from '@angular/core/testing';

import { AddProjectService } from './add-project.service';
import { HttpClientModule } from '@angular/common/http';

describe('AddProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[
      HttpClientModule
      
      
      ],
      providers:[]
  }));

  it('should be created', () => {
    const service: AddProjectService = TestBed.get(AddProjectService);
    expect(service).toBeTruthy();
  });
});
