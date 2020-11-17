import { TestBed } from '@angular/core/testing';

import { DashboardBoxService } from './dashboard-box.service';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardBoxService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    
    imports:[
    HttpClientModule
    
    ],
    providers:[]
  }));

  it('should be created', () => {
    const service: DashboardBoxService = TestBed.get(DashboardBoxService);
    expect(service).toBeTruthy();
  });
});
