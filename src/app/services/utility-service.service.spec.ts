import { TestBed } from '@angular/core/testing';

import { UtilityServiceService } from './utility-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Material } from '../material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UtilityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[
      HttpClientModule,
      Material,
      RouterTestingModule,
      BrowserAnimationsModule
      
      ],
      providers:[
        { provide: MatDialogRef, useValue: {} },
	{ provide: MAT_DIALOG_DATA, useValue: [] },
      ]
  }));

  it('should be created', () => {
    const service: UtilityServiceService = TestBed.get(UtilityServiceService);
    expect(service).toBeTruthy();
  });
});
