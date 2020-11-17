import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectdialogBoxComponent } from './add-projectdialog-box.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddProjectdialogBoxComponent', () => {
  let component: AddProjectdialogBoxComponent;
  let fixture: ComponentFixture<AddProjectdialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectdialogBoxComponent ]
      ,
      imports:[
        Material,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers:[
        { provide: MatDialogRef, useValue: {} },
	{ provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectdialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
