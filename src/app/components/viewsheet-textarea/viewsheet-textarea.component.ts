import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-viewsheet-textarea',
  templateUrl: './viewsheet-textarea.component.html',
  styleUrls: ['./viewsheet-textarea.component.scss']
})
export class ViewsheetTextareaComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild('textArea') searchElement: ElementRef;

  @Input()
  public set textMessage(v: any) {
    this.content.setValue(v);
  }
  @Input() formate: any;
  content1: any;

  @Input() headerType: any;

  constructor() { }

  // sendMessage() {
  //   this.messageContent.emit(this.content)
  // }

  //if()


  content = new FormControl('');

  ngOnInit() {
    console.log(this.formate);

    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 200);

    if (this.formate === 'email') {
      this.content.setValidators([Validators.email, Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$')]);
    }
    else if (this.formate === 'date') {
      this.content.setValidators([Validators.required, Validators.pattern('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')]);
    }
    else if (this.formate === 'mobile') {
      this.content.setValidators([Validators.required, Validators.pattern('^[7-9][0-9]{9}$')]);
    }
    // else if (this.headerType === 'number') {
    //   this.content.setValidators([Validators.required, Validators.pattern('[0-9][0-9,\.]*$')]);
    // }
    // else if (this.headerType === 'count') {
    //   this.content.setValidators([Validators.required, Validators.pattern('/^[0-9]+([.][0-9]+)?$/')]);
    // }


  }
  myfunction(e) {
    console.log('in my function', String.fromCharCode(e.charCode));

    var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);

    return e.charCode === 0 || p.test(String.fromCharCode(e.charCode));
  }
  numfunction(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        if (charCode == 46) { return true; }
        else { return false; }
    }
    return true;
}
  textContent(data) {
    console.log(data);

    this.messageEvent.emit(data);


  }

}
