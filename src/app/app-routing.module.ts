import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardBoxComponent } from './components/dashboard-box/dashboard-box.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { VeiwSheetsComponent } from './components/veiw-sheets/veiw-sheets.component';
import { AddFundoosheetComponent } from './components/add-fundoosheet/add-fundoosheet.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },

  {
    
    path: 'projects/:projectId/sheets/:sheetId/view',
    component: VeiwSheetsComponent
  },

  {
    canActivate: [AuthGuardService],
    path: '',
    component: DashboardComponent,
     children: [
       {
         path: 'projects/:projectId',
         component: DashboardBoxComponent,
       }, 
      {
        path: 'projects/:projectId/sheets',
        component: AddFundoosheetComponent
      }
     ]
  },
  { canActivate: [AuthGuardService],
    path: 'projects',
    component: ToolbarComponent,
    children: [
      {
        path: '',
        component: AddProjectComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
