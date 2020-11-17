import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addProject } from '../../model/addProject.model';
import { AddProjectService } from '../../services/add-project.service';
import { DataService } from '../../services/data.service';

// const projectDetails = {
//   projectName: '',
//   description: ''
// };

@Component({
  selector: 'app-add-projectdialog-box',
  templateUrl: './add-projectdialog-box.component.html',
  styleUrls: ['./add-projectdialog-box.component.scss']
})

export class AddProjectdialogBoxComponent implements OnInit {
  project: addProject = new addProject();
  disabled: boolean;
  projectName = new FormControl(this.project.projectName, [Validators.required, Validators.minLength(3),this.noWhitespaceValidator,Validators.pattern('^([a-zA-Z]*$)')]);
  description = new FormControl(this.project.description, [Validators.required, Validators.minLength(3),this.noWhitespaceValidator]);

  constructor(
    public dialogBox: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addProjectService: AddProjectService,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  projectNameError() {
    return this.projectName.hasError('required') ? 'Project Name is required' :
    this.projectName.hasError('whitespace') ? 'Not Valid ProjectName':
      this.projectName.hasError('minlength') ? 'Minimum length must be 3' :
    
      this.projectName.hasError('pattern') ? 'Project Names  Must Contains alphabets Only':
      
        '';
  }

  descriptionError() {
    return this.description.hasError('required') ? 'Description is required' :
      this.description.hasError('minlength') ? 'Minimum length must be 3' : '';
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
    }
  addProject(project) {
    this.project = {
      projectName: this.projectName.value,
      description: this.description.value
    };
    this.addProjectService.addProject(this.project).subscribe(
      (response: any) => {
        this.dataService.changeMessage({});
        console.log('add project response ------>', response);
        this.snackBar.open(
          'Project added successfully..',
          '',
          { duration: 2500 }
        );
      }
    );
  }

}
