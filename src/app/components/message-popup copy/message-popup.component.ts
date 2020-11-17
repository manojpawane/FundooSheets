import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VeiwSheetsComponent, DialogData } from '../veiw-sheets/veiw-sheets.component';


@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<VeiwSheetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
message: string;
  ngOnInit() {
    console.log("messages>>>>>.",this.data);
  }

}
