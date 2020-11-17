import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBoxComponent } from './dashboard-box.component';
import { Material } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardBoxComponent', () => {
  let component: DashboardBoxComponent;
  let fixture: ComponentFixture<DashboardBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBoxComponent ],
      imports:[
        Material,
        HttpClientModule
      ],
      providers:[]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
