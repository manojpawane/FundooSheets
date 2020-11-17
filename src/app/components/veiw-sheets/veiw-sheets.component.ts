import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SheetServiceService } from 'src/app/services/sheet-service/sheet-service.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MessagePopupComponent } from '../message-popup/message-popup.component';
import { Location } from '@angular/common';
import { ViewsheetTextareaComponent } from '../viewsheet-textarea/viewsheet-textarea.component';
import { log } from 'util';

export interface Food {
  value: string;
  viewValue: string;
}

export interface DialogData {
  message: String;

}

@Component({
  selector: 'app-veiw-sheets',
  templateUrl: './veiw-sheets.component.html',
  styleUrls: ['./veiw-sheets.component.scss']
})
export class VeiwSheetsComponent implements OnInit {
  // headers = [5,6,7,8,9,6,7,8,6,6,7,8,9,7,8,6,8,7,8,5,6,7,8,9,6,7,8,6,6,7,8,9,7,8,6,8,7,8];
  rows = [5, 6, 7, 8];
  
  
  // projectId = localStorage.getItem('projectId');
  //numberAdd =new FormControl('',[Validators.required, Validators.pattern(new RegExp(/\b((100)|[1-9]\d?)\b/))]);
  headersData = [];
  objectKey = Object.keys;
  rowsData = [];
  requiredFields = [];
  selectedOption: any;
  textOption: any;
  autoOption: any;
  data: any;
  projectName: any;
  sheetNames: [];
  errorFirst = true; // only showing snackbar 1 time
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router,
    private dataService: DataService, public fb: FormBuilder,
    private httpservice: SheetServiceService, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService,
    private _location: Location) { }
  arrayLength = 0;
  focusRowIndex;
  focusColumnIndex;
  num: any = [];
  sheetId = this.route.snapshot.paramMap.get('sheetId');
  registrationForm = this.fb.group({
    cityName: ['', [Validators.required]]
  });
  record = [];
  dummyRow = [];
  updateArray = [];
  suggestionArray = [];
  suggestionArrayWithDuplicate = [];
  rowsLength;
  changedLength;


  ngOnInit() {

    this.getRowsData();
  
    // this.dataService.currentMessage1.subscribe(response => {
    //   console.log('My response=>', response);

    // });


    // localStorage.setItem('token-N', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNWJkNDZjZDE4NjcwMDAxOWRmNjAyNSIsImVtYWlsIjoibmFnZW5kcmEuc2luZ2hAYnJpZGdlbGFiei5jb20iLCJleHAiOjE1NzE4MzM1NzUsImlhdCI6MTU2NjY0OTU3NX0.YxV6j2LxPhneG1tBmMShfuhiHn98iQ4Mp7qmAzYcRtc');
    // this.projectName = localStorage.getItem('projectName');
    // console.log("project name:",this.projectName);

  }
  addRows(num) {
    if (num < 100) {
      for (let i = 0; i < num; i++) {
        this.num.push({ isClicked: false });
      }
      console.log('num is ', this.num, ' record is ', this.record);
    }


  }
  cancel() {
    this.router.navigate(['/projects/' + this.route.snapshot.paramMap.get('projectId') + '/sheets']);
    // this._location.back();
  }

  getRowsData() {
    // var option = {..
    //   url = '/projects/projectId/sheets/sheetId';
    // }
    this.spinnerService.show();
    this.httpservice.getRequest('/projects/' + this.route.snapshot.paramMap.get('projectId') + '/sheets/' + this.sheetId).subscribe(
      (response: any) => {
        console.log(response);
        this.sheetNames = response.sheetInfo;
        this.projectName = response.projectName;
        this.rowsData = response.fields;
        for (const header of this.rowsData) {
          header['isColumnClicked'] = false;
        }
        console.log('rows===>', this.rowsData);
        this.headersData = (response as any).fields;
        console.log('Data of header', this.headersData[0]);
        this.num = response.records;
        console.log('num array is===>', response.records);
        this.suggestionArray = [];
        this.suggestionArrayWithDuplicate = [];
        this.dummyRow = [];
        for (let i = 0; i < this.headersData.length; i++) {
          this.dummyRow.push(
            {
              name: this.headersData[i].name,
              value: '',
              isChanged: false,
              isRequired: this.headersData[i].required,
            }
          );
          if (!this.headersData[i].isEnum && this.headersData[i].allowSuggestion) {
            this.pushAllSuggestionArray(i);
          } else {
            this.suggestionArray.push([]);
            this.suggestionArrayWithDuplicate.push([]);
          }
          if (this.headersData[i].required) {
            this.requiredFields.push(this.headersData[i].name);
          }

        }
        this.rowsLength = response.records.length;
        this.changedLength = this.rowsLength;
        this.updateArray = [];

        for (let i = 0; i < response.records.length; i++) {
          const updatedummy = [];
          for (const j of this.headersData) {
            updatedummy.push({
              name: j.name,
              value: response.records[i][j.name],
              isChanged: false,
              isRequired: j.required
            });
          }

          this.updateArray.push({
            isChanged: false,
            rowId: response.records[i]._id,
            array: updatedummy,
            index: i + 1
          });
        }
        this.dataService.viewChangeMessage(this.updateArray);
        for (let i = 0; i < 10; i++) {
          if (i < response.records.length) {
            this.num[i]['isRowClicked'] = false;
          } else {
            this.num.push({ isClicked: false });
          }

        }
        setTimeout(() => {
          this.spinnerService.hide();
        }, 2000);
      },
      error => {
        console.log('error', error);
        this.spinnerService.hide();

      }
    );
  }
  pushAllSuggestionArray(index) {

    let result = this.num.map(a => {
      return a[this.headersData[index].name];

    });
    this.suggestionArrayWithDuplicate.push(result);
    let uniqueItems = Array.from(new Set(result));
    if (uniqueItems[uniqueItems.length - 1] === '') {
      uniqueItems.pop();
    }
    this.suggestionArray.push(uniqueItems);



  }
  reciveOption(event, row, column) {
    if (event == null) {
      event = '';
    }
    // this condition is for add a new row
    this.checkRowPresent(event, row, column);

  }
  getDummyArray() {
    const arr = [];
    for (const iterator of this.dummyRow) {
      arr.push({
        name: iterator.name,
        value: '',
        isRequired: iterator.isRequired
      });
    }
    return arr;
  }
  checkRowPresent(event, row, column) {
    if (row >= this.rowsLength) {
      // this condtion is for check there is row is present in record or not
      if (this.record[row - this.rowsLength]) {
        this.record[row - this.rowsLength].array[column].value = event;
        this.record[row - this.rowsLength].isChanged = true;
      } else {
        this.pushArray(row, (changed) => {
          if (changed) {
            this.changedLength = this.rowsLength + this.record.length;
            this.record[row - this.rowsLength].array[column].value = event;
            this.record[row - this.rowsLength].isChanged = true;
          }
        });
      }

    } else {
      console.log(event, 'row ', row, ' column  ', column, ' update array ', this.updateArray);
      this.updateArray[row].array[column].value = event;
      this.updateArray[row].array[column].isChanged = true;

      this.updateArray[row].isChanged = true;
      console.log(this.updateArray);

    }
    console.log('update ', this.updateArray, '   add array', this.record);

  }
  pushArray(row, callback) {
    for (let i = 0; i <= (row - this.changedLength); i++) {
      this.record.push({
        isChanged: false,
        array: this.getDummyArray(),
        index: Number(row + i) + 1
      });
      if (i == (row - this.changedLength)) {
        callback(true);
      }
    }
  }


  reciveTextMessage($event, row, column) {
    this.checkRowPresent($event, row, column);

  }
  reciveAutoMessage($event, row, column) {
    console.log('event is ', $event, 'row is ', row, '  column is ', column);

    this.pushToSuggestionArray(column, row, $event);

    this.checkRowPresent($event, row, column);

  }
  pushToSuggestionArray(i, j, value) {
    if (this.suggestionArrayWithDuplicate[i].length <= j) {
      for (let ind = this.suggestionArrayWithDuplicate[i].length; ind <= j; ind++) {
        if (ind < j || value === '') {
          this.suggestionArrayWithDuplicate[i].push(undefined);
        } else {
          this.suggestionArrayWithDuplicate[i].push(value);

        }
      }
      // this.suggestionArray[i].push(value);
    } else {
      this.suggestionArrayWithDuplicate[i][j] = value;
    }

    const uniqueItems = Array.from(new Set(this.suggestionArrayWithDuplicate[i]));
    if (uniqueItems[uniqueItems.length - 1] === '') {
      uniqueItems.pop();
    }
    this.suggestionArray[i] = [];
    this.suggestionArray[i] = uniqueItems;
  }
  checkAnyFieldAvailable(array, callback) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.value.length > 0) {
        // isFieldAvailable = true;
        callback(true);
      }
      if (i === array.length - 1) {
        callback(false);
      }
    }
    if (array.length === 0) {
      callback(false);
    }

  }


  checkRequiredValue(object, callback) {
    for (let i = 0; i < object.array.length; i++) {
      console.log('field in array', object.array[i]);

      if (object.array[i].isRequired) {

        if (object.array[i].value === undefined || object.array[i].value === '') {
          this.checkAnyFieldAvailable(object.array, (condition) => {
            if (condition) {
              callback(object.array[i].name + ' header is required field at row number ' + object.index, null);
              setTimeout(() => {
                i = object.array.length;
              }, 100);
            } else {
              // object.array.splice(i, 1);
              // i--;
              console.log('object in check', condition);
              callback(null, false);
              i = object.array.length;

            }
          });
        }
        if (i === object.array.length - 1) {
          console.log('after complete length', i);
          callback(null, true);
        }
      }

    }

  }
  createJsonForBackend(callback) {
    const update = [];
    for (const i of this.updateArray) {
      // console.log("i in json creation", i);
      if (i.isChanged) {
        const arr = [];
        for (let ind = 0; ind < i.array.length; ind++) {
          const element = i.array[ind];
          console.log('data update array', element);

          if (element.isChanged) {
            if (element.isRequired && (element.value === '' || element.value === undefined)) {
              callback(element.name + ' header is required field at row number ' + i.index, null);
              break;
            } else {
              arr.push(element);
            }
          }
          if (ind === i.array.length - 1) {
            update.push({
              rowId: i.rowId,
              info: arr
            });
          }
        }
      }
    }
    let i = 0;
    for (i = 0; i < this.record.length; i++) {
      if (this.record[i].isChanged) {
        console.log('element is in andd', this.record[i]);
        this.checkRequiredValue(this.record[i], (err, data) => {
          if (err) {
            callback(err, null);
          } else if (data) {
            console.log('afetre succes', data);
            update.push({
              rowId: '',
              info: this.record[i].array
            });
          }
          if (i === this.record.length - 1) {
            callback(null, update);

          }
        });
      }
    }
    if (i === this.record.length - 1 || i === 0) {
      callback(null, update);

    }
  }

  saveRows() {
    this.errorFirst = true;
    console.log('update array is ', this.updateArray);

    this.createJsonForBackend((err, data) => {
      if (err) {
        if (this.errorFirst) {
          this.snackBar.open(
            err, '',
            { duration: 2500 }
          );
          this.errorFirst = false;
        }
      } else {
        console.log('data from callback', data);

        if (data.length > 0 && this.errorFirst) {
          // for (const iterator of data) {
          //   this.replaceUndefinedValue(iterator.info);


          // }
          const object = {
            records: data
          };
          this.httpservice.postRequest('/projects/' + this.route.snapshot.paramMap.get('projectId') + '/sheets/' + this.sheetId + '/rows',
            object).subscribe(
              response => {
                this.record = [];
                // localStorage.setItem('token', String((response as any).data));
                this.snackBar.open(
                  "save row's successfully..",
                  '',
                  { duration: 2500 }
                );
                this.getRowsData();
              },
              (error) => {
                this.snackBar.open(
                  error.error.message,
                  'cancel',
                  { duration: 2500 }
                );
                console.log(error);
                this.makeAllchangesFalse(this.updateArray);
                this.makeAllchangesFalse(this.record);


              }
            );
        }
      }

    });

  }


  openDialog(i): void {
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.deleteRow(i);
      }

    });
  }
  makeAllchangesFalse(arrayGiven) {
    for (const iterator of arrayGiven) {
      if (iterator.isChanged) {
        iterator.isChanged = false;
      }
    }

  }


  deleteRow(i) {
    // console.log("id.....", this.updateArray[i].rowId);
    this.httpservice.deleteRequest('/projects/' + this.route.snapshot.paramMap.get('projectId') + '/sheets/' + this.sheetId + '/row/' + i)
      .subscribe(
        (response: any) => {
          this.snackBar.open(response.message, '',
            { duration: 2500 }
          )
          this.getRowsData();
        },
        (error) => {
          // this.snackBar.open(error.error.message, '',
          //   { duration: 2500 }
          // );
        }

      );

  }
  focusIndexChange(rowIndex, columnIndex) {
    console.log(this.focusRowIndex);

    if (this.focusRowIndex === undefined) {
      this.focusRowIndex = rowIndex;
      this.focusColumnIndex = columnIndex;
      this.num[this.focusRowIndex].isRowClicked = true;
      this.rowsData[this.focusColumnIndex].isColumnClicked = true;
      console.log('this.focusIndex first', this.focusRowIndex, 'index   ', this.rowsData);

    } else {
      console.log("this.focusRowIndex", this.focusRowIndex, "this.focusColumnIndex", this.focusColumnIndex, "rowIndex", rowIndex, "col", columnIndex);

      this.num[this.focusRowIndex].isRowClicked = false;
      this.rowsData[this.focusColumnIndex].isColumnClicked = false;
      this.focusRowIndex = rowIndex;
      this.focusColumnIndex = columnIndex;
      this.num[this.focusRowIndex].isRowClicked = true;
      this.rowsData[this.focusColumnIndex].isColumnClicked = true;
      console.log('this.focusIndex se', this.focusRowIndex, 'index   ', this.rowsData);
    }

  }

}
