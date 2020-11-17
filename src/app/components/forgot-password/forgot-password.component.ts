import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/services/utility-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ToastType } from 'src/app/model/ToastType.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
const forgotDetails = {
  emailId: '',
};
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  hide = false;
  disableSubmit = false;
  forgotForm: FormGroup;
  email = new FormControl(forgotDetails.emailId, [Validators.required, 
    Validators.email,
    Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$')]);

  constructor(private router: Router, private utilityService: UtilityServiceService, private usersevice: UserServiceService,private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  }
  getErrorMessageEmail() {
    return this.email.hasError('required') ? 'EmailId Is Required.' :
      this.email.hasError('email') ? 'Enter Valid EmailId.' :
      this.email.hasError('pattern') ? 'Enter Valid EmailId':
        '';
  }
  forgot() {
    this.spinnerService.show();
    console.log('forgot');
    console.log(this.email);
    this.disableSubmit = true;

    forgotDetails.emailId = this.email.value;
    const OBJ = {

      email: forgotDetails.emailId,

    };
    this.usersevice.forgot(OBJ).subscribe(response => {
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

  }
  login() {
    this.router.navigate(['/login']);
  }
}
