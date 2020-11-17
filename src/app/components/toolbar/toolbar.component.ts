import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { MessagePopupComponent } from '../message-popup/message-popup.component';

export interface DialogData {
  message: String;

}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public emailId = localStorage.getItem('emailId');

  public username =  this.emailId.substr(0,  this.emailId.length - 10);
  constructor(private router: Router,public matDialog: MatDialog) { }

  
  ngOnInit() {
  }


  logout() {
    // localStorage.removeItem('token');
    // localStorage.clear();
    // this.router.navigate(['/login']);
  

    const dialogRef=this.matDialog.open(MessagePopupComponent,{
      width:'300px',
      height:'fit-content',
      data: { message: 'Are you sure you want to logout?' }
    });
    dialogRef.afterClosed().subscribe(results=>{
      if(results){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    });
  }
}
