import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwSheetsComponent } from './veiw-sheets.component';

describe('VeiwSheetsComponent', () => {
  let component: VeiwSheetsComponent;
  let fixture: ComponentFixture<VeiwSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeiwSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
