import { TestBed } from '@angular/core/testing';

import { HttpServiceService } from './http-service.service';
import { HttpClientModule } from '@angular/common/http';

describe('HttpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[
      HttpClientModule
      
      ],
      providers:[]
  }));

  it('should be created', () => {
    const service: HttpServiceService = TestBed.get(HttpServiceService);
    expect(service).toBeTruthy();
  });
});
