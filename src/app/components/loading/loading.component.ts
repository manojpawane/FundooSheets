import { Component, OnInit } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  config = {
    animationType:ngxLoadingAnimationTypes.doubleBounce,
    primaryColour:'#7F961E',
    secondaryColour:'#40494D'
  }

  constructor() { }

  ngOnInit() {
  }

}
