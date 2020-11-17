import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserServiceService } from '../../services/user-service.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports:[
        Material,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers:[UserServiceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid', () => {
    component.email.setValue('');
    component.email.setValue('Aabc@gmail.com');
    component.email.setValue('@abc.ABC.com');

    expect(component.email.valid).toBeFalsy();

  });
  it('should be valid', () => {
    component.email.setValue('rohankadam@gmail.com');
    component.email.setValue('rohankadam23323@gmail.com');
    expect(component.email.valid).toBeTruthy();

  });
});
