import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DashboardBoxService } from '../../services/dashboard-box.service';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-box',
  templateUrl: './dashboard-box.component.html',
  styleUrls: ['./dashboard-box.component.scss']
})
export class DashboardBoxComponent implements OnInit, OnDestroy {
  reportIdInfo: any;
  lab: any;
  lab1: any[];
  array: any[];
  array1: any[];
  techtypeData: any[];
  dataArray: any[];
  objectKeys = Object.keys;
  objectValues = Object.values;
  reportArray: any[];
  eumnData: boolean;
  private subscription: Subscription;


  constructor(private dashboardServices: DashboardBoxService,
    private activeRouter: ActivatedRoute,
    private dataService: DataService,
    private matSnackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.techstack();
  }


  techstack() {
    this.spinnerService.show();
    this.subscription = this.dataService.reportSheetCurrent.subscribe((response: any) => {
      this.reportIdInfo = response;
      console.log("report id info========>", this.reportIdInfo);

      // console.log("in dashboard box project id =============>",);
      // console.log("in dashboard box sheet id =============>", this.reportIdInfo.sheetid);


      if (this.reportIdInfo.projectid != null && this.reportIdInfo.projectid != '' && this.reportIdInfo.sheetid != null && this.reportIdInfo.sheetid != '') {
        this.dashboardServices.getdashboardReport(this.reportIdInfo.projectid, this.reportIdInfo.sheetid).subscribe(
          (response: any) => {
            console.log("in service", response)
            this.techtypeData = response;
            // console.log('tech type data=>>>', this.techtypeData);
            for (let item of this.techtypeData) {
              for (let i in item) {
                if (typeof (item[i]) === 'object') {
                  // console.log("in if loop ===============>", item[i])
                  this.dataArray = item[i];
                  // console.log("data array is ===================>", this.dataArray)
                  for (var key in this.dataArray) {
                    if (this.dataArray.hasOwnProperty(key)) {
                      // console.log("here key and valu", key + ": " + this.dataArray[key]);
                    }
                  }

                }
              }
            }
            if (this.techtypeData.length != null) { this.eumnData = true }
            this.spinnerService.hide();
          },
          error => {
            this.techtypeData = [];
            this.eumnData = false
            this.matSnackBar.open(
              "Can't generate report ,  No enum headertype found",
              "undo",
              { duration: 2500 }
            )

          }
        )
        this.spinnerService.hide();
      } else {
        this.eumnData = false;
      }
    });
  }
  ngOnDestroy() {
    // this.dataService.reportSheetCurrent
    this.subscription.unsubscribe();
  }

}
