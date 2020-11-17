import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AddSheetService } from 'src/app/services/add-sheet.service';
import { UtilityServiceService } from 'src/app/services/utility-service.service';
import { ToastType } from 'src/app/model/ToastType.enum';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-sheetdialog-box',
  templateUrl: './add-sheetdialog-box.component.html',
  styleUrls: ['./add-sheetdialog-box.component.scss']
})
export class AddSheetdialogBoxComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddSheetdialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addsheetservice: AddSheetService,
    private utilityService: UtilityServiceService,
    private dataService: DataService) { }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  sheets: any;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  keywords = [];
  allowSelected: boolean;
  requiredSelected: boolean;
  headerTypes = new FormControl('', Validators.required);
  formatType = new FormControl('', Validators.required);
  optionType = new FormControl('', Validators.required);
  selected;
  // disabled=false;
  if(selected = 'enum') {

  }
  headers = this.headerTypes.value
  Type = [
    { value: 'enum', viewValue: 'Enum' },
    { value: 'text', viewValue: 'Text' },
    { value: 'number', viewValue: 'Number' },
    { value: 'count', viewValue: 'Count' },
    { value: 'key', viewValue: 'Key' },
    { value: 'geocode', viewValue: 'GeoCode' }

  ];
  // none,mobile,email,date,currency
  Format = [
    { value: 'none', viewValue: 'None' },
    { value: 'date', viewValue: 'Date' },
    // {value: 'currency', viewValue: 'Curreny'},
    { value: 'mobile', viewValue: 'Mobile' },
    { value: 'email', viewValue: 'Email' }

  ];
  option = [
    { value: 'java', viewValue: 'Java' },
    { value: 'mean', viewValue: 'MEAN' },
    { value: 'mear', viewValue: 'MEAR' },
    { value: 'deveOps', viewValue: 'DevOPs' }
  ];


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      this.keywords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(keyword: any): void {
    console.log('keyword', keyword);

    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onSave() {
    console.log(this.formatType.value);
    console.log(this.headerTypes.value);
    console.log(this.allowSelected);
    console.log(this.requiredSelected);
    console.log(this.data);
    const OBJ = {
      'field': [
        {
          'name': this.data.header,
          'headerType': this.headerTypes.value,
          'allowSuggestion': this.allowSelected,
          'format': this.formatType.value,
          'required': this.requiredSelected,
          'options': this.keywords

        }
      ]
    };

    console.log(OBJ);
    this.addsheetservice.addfields(this.data.projectid, this.data.sheetid, OBJ).subscribe(response => {
      console.log(response + JSON.stringify(response));
      this.dataService.changeMessage(this.data.projectid)

      this.dialogRef.close(true);
    },
      (error) => {

        console.log(error.error.code);
        console.log(error.error.message);


        this.utilityService.showToast(ToastType.ERROR, error.error.message);
      }

    );


  }

}
