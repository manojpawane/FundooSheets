import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSheetdialogBoxComponent } from './add-sheetdialog-box.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddSheetdialogBoxComponent', () => {
  let component: AddSheetdialogBoxComponent;
  let fixture: ComponentFixture<AddSheetdialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSheetdialogBoxComponent ],
      imports: [
        Material,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSheetdialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
