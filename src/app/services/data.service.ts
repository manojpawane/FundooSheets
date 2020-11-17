import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();


  private messageSource1 = new BehaviorSubject('');
  currentMessage1 = this.messageSource1.asObservable();
  private messageSource2 = new BehaviorSubject('');
  currentMessage2 = this.messageSource2.asObservable();
  private deleteSheet = new BehaviorSubject('');
  deleteSheetCurrent = this.deleteSheet.asObservable();
  private reportSheet = new BehaviorSubject('');
  reportSheetCurrent = this.reportSheet.asObservable();
  MessageAdded = new Subject();

  sheetReport(message: any) {
    this.reportSheet.next(message)
  }

  changeMessage(message: any) {
    this.messageSource.next(message)
  }
  changeMessage1(message: any) {
    this.messageSource1.next(message)
  }
  changeMessage2(message: any) {
    this.messageSource2.next(message)
  }
  deletesheets(message: any) {
    this.deleteSheet.next(message)
  }


  viewChangeMessage(value: any) {
    console.log("value =>", value)
    this.messageSource1.next(value)
  }

}
