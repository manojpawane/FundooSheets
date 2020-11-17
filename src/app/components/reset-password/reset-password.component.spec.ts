import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ]
      ,
      imports: [
        Material,
        HttpClientModule,
        RouterTestingModule

        , BrowserAnimationsModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid', () => {

    component.password.setValue('adbvccd');
    component.password.setValue('');



    expect(component.password.valid).toBeFalsy();
  });
  it('should be valid', () => {

    // component.password.setValue('@133323');
    component.password.setValue('asd1234');
    component.password.setValue('12123454');
    expect(component.password.valid).toBeTruthy();
  });
});
