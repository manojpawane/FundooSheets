import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFundoosheetComponent } from './add-fundoosheet.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('AddFundoosheetComponent', () => {
  let component: AddFundoosheetComponent;
  let fixture: ComponentFixture<AddFundoosheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFundoosheetComponent ],
      imports:[
        Material,
        HttpClientModule,
        RouterTestingModule
      ],
      providers:[]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFundoosheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
