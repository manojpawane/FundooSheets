import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectdialogBoxComponent } from '../add-projectdialog-box/add-projectdialog-box.component';
import { AddProjectService } from '../../services/add-project.service';
import { DataService } from '../../services/data.service';
import { Router, Routes, RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { empty } from 'rxjs';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})

export class AddProjectComponent implements OnInit {
  public dialogRef: any;
  public projects: any;
  toggle = false;
  public projectId: string;

  @Output() messageEvent = new EventEmitter<any>();

  constructor(
    public matDialog: MatDialog,
    private addProjectService: AddProjectService,
    private router: Router,
    private dataService: DataService,
    private spinnerService: Ng4LoadingSpinnerService
    
  ) { }

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message =>
      this.getProject()
      );
  }

  openDialog() {
    const dialogRef = this.matDialog.open(AddProjectdialogBoxComponent, {
      width: '513px', height: '301px',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getProject() {
    this.spinnerService.show()
    this.addProjectService.getProject().subscribe(
      (response: any) => {
        console.log('get all project response ------>', response);
        this.projects = response;
        if (this.projects.length === 0) {
          this.toggle = true;
        } else {
          this.toggle = false;
        }
      }
    
    );
    this.spinnerService.hide();
  }
  dashboard(projectId) {
    console.log('project id :::::::', projectId);
    console.log('/projects/{' + projectId + '}');
    localStorage.removeItem('sheetId');
    this.router.navigate(['/projects/'+projectId])
  
  }
}
