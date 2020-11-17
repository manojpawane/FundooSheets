import { Component, OnInit } from '@angular/core';
import { AddSheetService } from '../../services/add-sheet.service';
import { Router, Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddSheetdialogBoxComponent } from '../add-sheetdialog-box/add-sheetdialog-box.component';
import { FormControl, Validators } from '@angular/forms';
import { Sheet } from 'src/app/model/sheet.model';
import { UtilityServiceService } from 'src/app/services/utility-service.service';
import { ToastType } from 'src/app/model/ToastType.enum';
import { DataService } from 'src/app/services/data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MessagePopupComponent } from '../message-popup/message-popup.component';

const sheetsDetails = {
  sheetNames: '',
  description: ''

};
const headers = {
  header: '',
};

@Component({
  selector: 'app-add-fundoosheet',
  templateUrl: './add-fundoosheet.component.html',
  styleUrls: ['./add-fundoosheet.component.scss']
})
export class AddFundoosheetComponent implements OnInit {
  changeText: boolean;
  constructor(private addSheetService: AddSheetService, private utilityService: UtilityServiceService,
    public matDialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService
  ) {

  }

  public sheets: any;
  public sheetsfields: any;
  private popup3: boolean;
  i: any;

  projectId = localStorage.getItem('projectId')
  public popup: boolean;
  public popup1: boolean;
  private addHeader: string;
  private editables = false;
  private sheetId1: string;
  //  name: string;
  marked = false;
  theCheckbox = false;
  message: any;
  message1: any;
  sheetNames = new FormControl(sheetsDetails.sheetNames);
  description = new FormControl(sheetsDetails.description);
  header = new FormControl(headers.header);

  ngOnInit() {

    this.route.params.subscribe((data) => {
      console.log('route is changed', data);
      this.getSheets(data.projectId);

    });

    this.spinnerService.show();
    // this.getSheets(this.route.snapshot.paramMap.get('projectId'));

    // this.dataService.currentMessage2.subscribe((data) => {
    //   console.log("Data from 2nd service", data);
    //   if (data != null && data != '') {
    //     this.getSheets(data);
    //     // this.router.navigate(['/projects/' + data + '/sheets']);
    //     // this.getSheets(this.route.snapshot.paramMap.get('projectId'));
    //   }
    // })
    // this.dataService.currentMessage.subscribe((data)=>{
    //   console.log("Data from 2nd",data);
    //   this.header.reset();
    //   this.getSheets(data);


    // })
    this.spinnerService.hide()
  }
  edit(sheetId, _id, header) {
    console.log('iuidfdshfdsfuh', sheetId, _id, header);

    const OBJ = {

      name: header

    };
    console.log(OBJ);


    this.addSheetService.editheader(this.route.snapshot.paramMap.get('projectId'), sheetId, _id, OBJ).subscribe(response => {
      console.log(response + JSON.stringify(response));
      this.getSheets(this.route.snapshot.paramMap.get('projectId'));
    },
      (error) => {

        console.log(error.error.code);
        console.log(error.error.message);


        this.utilityService.showToast(ToastType.ERROR, error.error.message);
      });


  }
  deletefields(sheetId, _id) {
    console.log('delete fields', sheetId, _id);
    this.addSheetService.deleteheader(this.route.snapshot.paramMap.get('projectId'), sheetId, _id).subscribe(response => {
      console.log(response + JSON.stringify(response));
      this.getSheets(this.route.snapshot.paramMap.get('projectId'));
    },
      (error) => {
      });


  }
  editable(_id) {
    this.editables = true;
    this.sheetId1 = _id;
    console.log(this.sheetId1);
    console.log(this.editables);
  }
  editfields(_id) {
    this.sheetId1 = _id;
    this.changeText = false;
  }
  onPopup() {

    this.popup = this.popup ? false : true;
    console.log('in pop up0', this.popup);
    this.popup3 = false;
  }

  onPopup1() {

    this.popup = !this.popup;
    console.log('in pop up1', this.popup1);
    console.log(this.sheetNames.value);
    console.log(this.description);
    console.log(this.projectId);

    console.log(this.sheetNames.value);
    console.log(this.description);
    console.log(this.projectId);
    console.log();

    // tslint:disable-next-line: no-shadowed-variable
    const sheetsDetails = new Sheet();
    sheetsDetails.sheetNames = this.sheetNames.value;
    sheetsDetails.description = this.description.value;
    const OBJ = {
      sheet: {
        sheetName: sheetsDetails.sheetNames,
        description: sheetsDetails.description
      }
    };
    console.log('/projects/{' + this.projectId + '}/sheet', OBJ);
    this.addSheetService.sheet(OBJ, this.route.snapshot.paramMap.get('projectId')).subscribe(response => {
      console.log(response + JSON.stringify(response));
      this.sheetNames.reset();
      this.description.reset();
      this.getSheets(this.route.snapshot.paramMap.get('projectId'));
      this.dataService.deletesheets('delete sheets')
    },
      (error) => {

        console.log(error.error.code);
        console.log(error.error.message);


        this.utilityService.showToast(ToastType.ERROR, error.error.message);
      });




  }
  deleteSheet(projectId, _id) {

    const dialogRef = this.matDialog.open(MessagePopupComponent, {
      width: '300px', height: 'fit-content',
      data: { message: 'Are you sure you want to delete Sheet?' }
    });
    dialogRef.afterClosed().subscribe(results => {
      if (results) {
        console.log(this.projectId, _id);
        this.addSheetService.deleteSheet(this.route.snapshot.paramMap.get('projectId'), _id).subscribe(response => {
          console.log(response + JSON.stringify(response));
          // this.utilityService.showToast(ToastType.SUCCESS,response.success.message);
          this.getSheets(this.route.snapshot.paramMap.get('projectId'));
          this.dataService.deletesheets('delete sheets')
        },
          (error) => {

            console.log(error.error.code);
            console.log(error.error.message);


            this.utilityService.showToast(ToastType.ERROR, error.error.message);
          });
      }
    });




  }
  getSheets(projectId1) {
    this.spinnerService.show();
    console.log("project id ", projectId1);
    if (projectId1 != null && projectId1 != '') {
      this.addSheetService.getSheet(projectId1).subscribe(
        response => {
          this.sheets = response;
        
          console.log('response=====>>>>>>>>>', this.sheets);
          console.log('responsehjgdnjubnxc jbh', response.length);
          console.log('sheetinfo', this.sheets.sheetinfo);
          console.log('fields info', this.sheets.fieldInfo);
        }
      );
      this.spinnerService.hide();
    }
  }
  getsheetsfields(projectId, sheetid) {
    this.addSheetService.getsheetsFields(projectId, sheetid).subscribe(
      response => {
        this.sheetsfields = response;
        console.log('response with fields', this.sheetsfields);

      }
    );
  }
  onPopup3(_id) {
    console.log('id is ', _id);


    this.header.reset();

    if (_id != null) {
      this.popup3 = true;
      this.addHeader = _id;
      console.log('in pop up3', this.popup3);
      //  this.getSheets(this.projectId);

    } else {

    }
  }

  onIncrement() {
    this.i = this.i + 1;
  }

  openDialogue(_id): void {
    console.log(this.header.value);
    console.log(this.projectId);
    console.log(_id);


    console.log('dialog box');
    if ((this.header.value) != null) {
      const dialogRef = this.matDialog.open(AddSheetdialogBoxComponent, {
        disableClose: true,
        width: '646px', height: 'fit-content',
        data: {

          header: this.header.value,
          projectid: this.route.snapshot.paramMap.get('projectId'),
          sheetid: _id
        }

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.header.reset();
          this.getSheets(this.route.snapshot.paramMap.get('projectId'));
        }

      });
    }
  }
  onCancel(_id) {
    this.addHeader == null;
    this.popup3 = false;
  }
  openSheets(_id) {
    console.log("Sheet ID from ====>", _id, this.route.snapshot.paramMap.get('projectId'));
    this.router.navigate(['/projects/' + this.route.snapshot.paramMap.get('projectId') + '/sheets/' + _id + '/view'])
    //  projects/:projectId/sheets/:sheetId/view
    console.log('/projects/' + _id);




  }

}
