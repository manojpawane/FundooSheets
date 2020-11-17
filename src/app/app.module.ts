import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { Material } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardBoxComponent } from './components/dashboard-box/dashboard-box.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AddProjectdialogBoxComponent } from './components/add-projectdialog-box/add-projectdialog-box.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { VeiwSheetsComponent } from './components/veiw-sheets/veiw-sheets.component';
import { NgxLoadingModule } from 'ngx-loading';
import { LoadingComponent } from './components/loading/loading.component';
import { AddFundoosheetComponent } from './components/add-fundoosheet/add-fundoosheet.component';
import { AddSheetdialogBoxComponent } from './components/add-sheetdialog-box/add-sheetdialog-box.component';
import { ViewsheetTextareaComponent } from './components/viewsheet-textarea/viewsheet-textarea.component';
import { MatSelectComponent } from './components/mat-select/mat-select.component';
import { MatAutocompleteComponent } from './components/mat-autocomplete/mat-autocomplete.component';

import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    DashboardBoxComponent,
    AddProjectComponent,
    AddProjectdialogBoxComponent,
    ToolbarComponent,
    VeiwSheetsComponent,
    LoadingComponent,
    AddFundoosheetComponent,
    AddSheetdialogBoxComponent,
    ViewsheetTextareaComponent,
    MatSelectComponent,
    MatAutocompleteComponent,
    MessagePopupComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    Material,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    Ng4LoadingSpinnerModule.forRoot()


  ],
  exports: [
    Material
  ],
  providers: [],
  entryComponents : [AddProjectdialogBoxComponent, MessagePopupComponent, AddSheetdialogBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
