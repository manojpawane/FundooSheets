import { Injectable } from '@angular/core';
import {CanActivate, Router, Routes, RouterModule } from '@angular/router';
import { MatSnackBar} from '@angular/material'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private matSnackBar: MatSnackBar) { }

  canActivate(
    route: import ('@angular/router').ActivatedRouteSnapshot,
    state: import ('@angular/router').RouterStateSnapshot): boolean |
    import ('@angular/router').UrlTree |
    import ('rxjs').Observable<boolean |
    import ('@angular/router').UrlTree> | Promise<boolean |
    import ('@angular/router').UrlTree>  {

       if ( localStorage.getItem('token') != null ) {
         // Token from the LogIn is avaiable, so the user can pass to the route
         return true;
       } else  {
         // Token from the LogIn is not avaible because something went wrong or the user wants to go over the url to the site
         // Hands the user to the LogIn page
         this.matSnackBar.open(
          "You are currently not logged in, please provide Login!",
          "undo",
          { duration: 2500 }
        )
         this.router.navigate( ['/login'] );
         return false;

       }

  }
}
