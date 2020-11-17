import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectService } from '../../services/add-project.service';
import { DataService } from 'src/app/services/data.service';
import { MessagePopupComponent } from '../message-popup/message-popup.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public projects: any[];
  public sheets: any;

  public sheetId: any;
  public projectArray: any[];
  private localid: any;
  public toggleId = localStorage.getItem('sheetId');
  private i = 1;

  selectedValue = '';
  selectedSheet = '';
  toggle = true;
  toggle1: boolean;
  particularSheetId: any;
  public emailId = localStorage.getItem('emailId');

  public username = this.emailId.substr(0, this.emailId.length - 10);

  constructor(private router: Router,
    private addProjectService: AddProjectService,
    public matDialog: MatDialog,
    private dataService: DataService,
    private route: ActivatedRoute) { }

  projectId = this.route.snapshot.children[0].params["projectId"]
  ngOnInit() {
    // console.log("toggle ", this.toggleId);

    // console.log("username is============>", this.username, this.route.snapshot.children[0].params["projectId"]);
    this.getProject(this.route.snapshot.children[0].params["projectId"]);
    // this.getSheets(this.route.snapshot.children[0].params["projectId"])
    this.projectArray = this.projects;
    // console.log("select value==========>", this.projectArray)
    this.dataService.deleteSheetCurrent.subscribe(
      message => {
        console.log('message in delete service ', message);
        if (message !== undefined && message !== null && message !== '') {
          this.getSheets(this.route.snapshot.children[0].params["projectId"])
        }
      }
    )

  }

  project() {
    this.router.navigate(['/projects'])
  }
  dashboard() {

    this.router.navigate(['/dashboard'])
  }

  fundooSheets(buttonName) {

    this.toggleId = buttonName;
    // console.log(buttonName);
    localStorage.setItem('sheetId', buttonName);
    // console.log(this.toggleId, "fundoosheet button name ===============>", this.route.snapshot.children[0].params["projectId"])
    this.toggle = !this.toggle;
    // console.log(this.toggle);
    // localStorage.setItem('to');

    // console.log("fundoosheets");
    this.localid = this.route.snapshot.children[0].params["projectId"];
    // this.dataService.changeMessage2(this.route.snapshot.children[0].params["projectId"]);
    this.router.navigate(['/projects/' + this.route.snapshot.children[0].params["projectId"] + '/sheets']);
  }

  getProject(projectId) {
    // console.log("Project id", projectId);

    this.addProjectService.getProject().subscribe(
      (response: any) => {
        // console.log('get all project response ------>', response);
        this.projects = response;
        if (response.length > 0) {

          //  this.getSheets(response[0]._id);
          for (var i = 0; i < response.length; i++) {
            if (response[i]._id == projectId) {
              this.selectedValue = response[i].projectName;
              console.log("project id  projected", response[i]);

              // console.log("selected value", this.selectedValue);

              this.getSheets(response[i]._id);
            }
          }

        }

      }
    );
  }
  setLocalStorage() {
    if (localStorage.getItem('sheetId') !== 'fundooSheetButton') {
      localStorage.removeItem('sheetId');
    }
  }
  getSheets(_id) {

    this.addProjectService.getParticularProject(_id).subscribe(
      (response1: any) => {
        console.log('get sheet after change project', response1);

        this.sheets = response1;
        let sheetId = localStorage.getItem('sheetId');
        if (this.sheets.length > 0) {
          this.particularSheetId = response1[0].sheetInfo._id;
          this.selectedSheet = response1[0].sheetInfo.sheetName;
          var selectedProjectId = response1[0].sheetInfo.projectId;
        } else {
          this.particularSheetId = undefined;
          this.selectedSheet = undefined;
          selectedProjectId = _id;
          localStorage.setItem('sheetId', 'fundooSheetButton');
          sheetId = 'fundooSheetButton';
          this.toggleId = 'fundooSheetButton';
        }
        if (sheetId !== 'fundooSheetButton' && sheetId !== 'setting') {
          if (sheetId == null) {
            this.getRecord(selectedProjectId, this.particularSheetId);
          } else {
            this.getRecord(selectedProjectId, sheetId);
          }
        } else if (sheetId === 'fundooSheetButton') {
          this.getFundooSheetsDifferentProject(selectedProjectId);
        }


        // console.log("get all sheets of project============>", this.sheets);
        // this.dataService.changeMessage2(_id);
        //  this.router.navigate(['/projects/'+ sheet._id +'/sheets']);

        //  this.router.navigate(['/projects/' + _id]);

        // if (!this.toggle) {
        //   this.toggle = false
        //   this.router.navigate(['/projects/' + _id + '/sheets']);
        // }

      }
      // }
    );
  }

  getFundooSheetsDifferentProject(id) {
    // this.dataService.changeMessage2(id);

    this.router.navigate(['/projects/' + id + '/sheets']);

  }

  getRecord(projectid, sheetid) {
    // console.log("from sheet", projectid)
    // console.log("from sheet", sheetid)
    console.log('get record method');

    this.toggleId = sheetid
    localStorage.setItem('sheetId', sheetid);
    this.toggle = !this.toggle;
    // console.log("project id is=================>", projectid);
    // console.log("sheet id is==============>", sheetid)
    this.dataService.sheetReport({
      projectid, sheetid,
      time: true
    });
    this.router.navigate(['/projects/' + projectid]);
  }

  logout() {
    const dialogRef = this.matDialog.open(MessagePopupComponent, {
      width: '300px', height: 'fit-content',
      data: { message: 'Are you sure you want to logout?' }
    });
    dialogRef.afterClosed().subscribe(results => {
      if (results) {
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    });

  }

  setting(settingbuttonName) {
    this.toggleId = settingbuttonName;
    localStorage.setItem('sheetId', settingbuttonName);
    // console.log(this.toggleId, "setting button name ===============>", settingbuttonName)
    this.toggle = !this.toggle;
  }
  ngOnDestroy() {
    // this.dataService.sheetReport(
  }
}
