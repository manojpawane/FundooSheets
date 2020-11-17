import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoadingComponent } from '../components/loading/loading.component';
import { ToastType } from '../model/ToastType.enum';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  dialogRef;
  private token = '';
  constructor(public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private router: Router) { }


  openLoader() {
    this.dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      panelClass: 'loader-style',
    });
  }

  closeLoader() {
    this.dialogRef.close();
  }

  showToast(type, message: string) {

    this._snackBar.open(message, null, {
      duration: 2500,
      panelClass: String(type)
    });
  }

  errorHandler(error) {
    this.showToast(ToastType.ERROR, error.error.message);

    const code = error.error.code;
    if (code === 422 || code === 404) {
      this.router.navigateByUrl('/');
    }
  }
  successhandler(success) {
    this.showToast(ToastType.SUCCESS, success.success.message);

    const code = success.error.code;
    if (code === 200 || code === 100) {
      this.router.navigateByUrl('/');
    }
  }

}
