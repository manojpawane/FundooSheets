import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from 'src/app/services/data.service';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-mat-select',
  templateUrl: './mat-select.component.html',
  styleUrls: ['./mat-select.component.scss']
})
export class MatSelectComponent implements OnInit {

  constructor(public fb: FormBuilder, private dataService: DataService) { }
  @Input() rows: any;
  @Input() selectedValue: any;
  @ViewChild('mySelect') mySelect: MatSelect;
  

  selectOption = this.fb.group({
    selectedValue: ['', [Validators.required]]
  })

  // changeValue(value){
  //  console.log("event--19",value); 
  //   this.dataService.viewChangeMessage(value);
  // }

  message: string;

  @Output() messageEvent = new EventEmitter<string>();
  changeValue(value) {
    this.messageEvent.emit(value);
  }

  ngOnInit() {
    setTimeout(() => {
      this.mySelect.open();
    }, 300);
  }
  change(value) {
    console.log('value is changed', value);

  }
}
