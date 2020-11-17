import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Material } from '../../material.module';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserServiceService } from '../../services/user-service.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        Material,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [UserServiceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

    component.password.setValue('adbvccd');
    component.password.setValue('');

    expect(component.email.valid).toBeFalsy();
    expect(component.password.valid).toBeFalsy();
  });
  it('should be valid', () => {
    component.email.setValue('rohankadam@gmail.com');
    component.email.setValue('rohankadam23323@gmail.com');
    // component.password.setValue('@133323');
    component.password.setValue('asd1234');
    expect(component.email.valid).toBeTruthy();
    expect(component.password.valid).toBeTruthy();
  });

});
