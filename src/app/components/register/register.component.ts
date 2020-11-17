import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../../model/register.model';
import { UserServiceService } from '../../services/user-service.service';
import { UtilityServiceService } from 'src/app/services/utility-service.service';
import { ToastType } from 'src/app/model/ToastType.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
const registerDetails = {
  emailId: '',
  password: '',
  confirmpassword: ''
};
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = false;
  hide1 = false;
  disableSubmit = false;

  email = new FormControl(registerDetails.emailId, [Validators.required, Validators.email, Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$')]);
  password = new FormControl(registerDetails.password, [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]);
  confirmpassword = new FormControl(registerDetails.confirmpassword, [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]);
  constructor(private router: Router, private usersevice: UserServiceService, private utilityService: UtilityServiceService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  }
  getErrorMessageEmail() {
    return this.email.hasError('required') ? 'EmailId Is Required.' :
      this.email.hasError('email') ? 'Enter Valid EmailId.' :
        this.email.hasError('pattern') ? 'Enter Valid EmailId.' :
          '';
  }
  getErrorMessagePassword() {
    return this.password.hasError('required') ? 'Password Feild Is Required.' :
      this.password.hasError('whitespace') ? 'Not a Valid Password' :
        this.password.hasError('minlength') ? 'Min Character For Password is 6' :

          '';
  }
  getErrorMessageConfrimPassword() {
    return this.confirmpassword.hasError('required') ? 'Password Feild Is Required.' :
      this.confirmpassword.hasError('whitespace') ? 'Not a Valid Password' :
        this.confirmpassword.hasError('minlength') ? 'Min Character For Password is 6' :

          '';
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  register() {
    this.spinnerService.show();
    this.password.markAsTouched;
    console.log(this.confirmpassword.value, this.password.value);

    if (!this.password.hasError('minlength') && !this.email.hasError('email') && (this.confirmpassword.value == this.password.value)) {
      console.log('successfull');
      console.log(this.email);
      console.log(this.password);
      this.disableSubmit = true;
      const registerDetails = new Register();
      registerDetails.emailId = this.email.value;
      registerDetails.password = this.password.value;
      var OBJ = {
        'user': {
          'email': registerDetails.emailId,
          'password': registerDetails.password
        }
      };
      // console.log("lodasfsf" +JSON.stringify(loginDetails));
      console.log(OBJ);
      this.usersevice.register(OBJ).subscribe(response => {
        console.log(response + JSON.stringify(response));
        localStorage.setItem('token', String((response as any).data));
        this.spinnerService.hide();
        this.router.navigateByUrl('/login');
      },
        (error) => {
          this.disableSubmit = false;
          console.log(error.error.code);
          console.log(error.error.message);


          this.utilityService.showToast(ToastType.ERROR, error.error.message);
        }

      );

    }
  }
  login() {
    this.router.navigate(['/login']);


  }
}
