import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsheetTextareaComponent } from './viewsheet-textarea.component';

describe('ViewsheetTextareaComponent', () => {
  let component: ViewsheetTextareaComponent;
  let fixture: ComponentFixture<ViewsheetTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsheetTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsheetTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
