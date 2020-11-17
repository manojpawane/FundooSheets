import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/services/utility-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ToastType } from 'src/app/model/ToastType.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

const resetDetails = {
  password: '',
  confirmpassword: ''
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hide = false;
  hide1 = false;
  disableSubmit = false;
  resetForm: FormGroup;
  password = new FormControl(resetDetails.password, [Validators.required, Validators.minLength(5),this.noWhitespaceValidator]);
  confirmpassword = new FormControl(resetDetails.confirmpassword, [Validators.required, Validators.minLength(5),this.noWhitespaceValidator]);
  constructor(private router: Router, private usersevice: UserServiceService, private  utilityService: UtilityServiceService,private spinnerService: Ng4LoadingSpinnerService  ) { }

  ngOnInit() {
  }

  getErrorMessagePassword() {
    return this.password.hasError('required') ? 'Password Feild Is Required.' :
    this.password.hasError('whitespace') ? 'Not a Valid':
      this.password.hasError('minlength') ? 'Min Character For Password is 6' :
    
        '';
  }
  getErrorMessageConfrimPassword() {
    return this.confirmpassword.hasError('required') ? 'Password Feild Is Required.' :
    this.confirmpassword.hasError('whitespace') ? 'Not a Valid':
      this.confirmpassword.hasError('minlength') ? 'Min Character For Password is 6' :
        '';
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
    }
  reset() {
    this.spinnerService.show();
    this.password.markAsTouched;
    if( !this.password.hasError('minlength')  && (this.confirmpassword.value==this.password.value)){
    console.log('successfull');

    console.log(this.password.value);
    this.disableSubmit = true;
    resetDetails.password = this.password.value;
    let OBJ = {

        password: resetDetails.password

    };
    console.log(localStorage.getItem('token'));

    this.usersevice.resetpassword(OBJ).subscribe(response => {
      console.log(response + JSON.stringify(response));

     this.spinnerService.hide();
      },
      (error) => {
      this.disableSubmit = false;
      console.log(error.error.code);
      console.log(error.error.message);


      this.utilityService.showToast(ToastType.ERROR, error.error.message);
      }

      );
  }}
  login() {
    this.router.navigate(['/login']);

  }
}
