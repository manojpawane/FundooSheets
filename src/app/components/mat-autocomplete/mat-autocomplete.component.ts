import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-mat-autocomplete',
  templateUrl: './mat-autocomplete.component.html',
  styleUrls: ['./mat-autocomplete.component.scss']
})
export class MatAutocompleteComponent implements OnInit {
  @ViewChild('autoComplete') searchElement: ElementRef;
  @Input() formate: any;
  @Input() headerType: any;
  @Input()
  public set selectedValue(v: any) {
    if (v !== undefined) {
      this.content.setValue(v);
    }
  }
  @Input()
  public set suggestionArray(v: any) {
    this.options = v;
    this.options = this.options.filter(function (element) {
      return element !== undefined && element !== '';
    });

  }
  content = new FormControl('');
  
  @Output() messageEvent = new EventEmitter<string>();

  // myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.content.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    setTimeout(() => {
      this.searchElement.nativeElement.focus();

    }, 200);
    if (this.formate === 'email') {
      this.content.setValidators([Validators.email, Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$')]);
    }
    else if(this.formate=="date")
    {
      this.content.setValidators([Validators.required, Validators.pattern('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')]);
    }
    else if(this.formate=="mobile")
    {
      this.content.setValidators([Validators.required , Validators.pattern('^[7-9][0-9]{9}$')]);
    }
    else if (this.headerType === 'number') {
      this.content.setValidators([Validators.required, Validators.pattern('[0-9][0-9,\.]*$')]);
    }

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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  textContent(value) {
    this.messageEvent.emit(value)
  }


}
