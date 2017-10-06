import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-platform-details',
  templateUrl: './platform-details.component.html',
  styleUrls: ['./platform-details.component.scss']
})
export class PlatformDetailsComponent implements OnInit {
  listsearchControl = new FormControl();
  premiumsearchControl = new FormControl();

  tabPlatform = true;
  tabHia = false;
  tabProvider = false;
  tabEmployer = false;
  tabBeneficiary = false;

  constructor() { }

  ngOnInit() {
  }

  tabClick(link: String) {
    switch (link) {
      case 'platform':
        this.tabPlatform = true;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        break;
      case 'hia':
        this.tabPlatform = false;
        this.tabHia = true;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        break;
      case 'provider':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = true;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        break;
      case 'employer':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = true;
        this.tabBeneficiary = false;
        break;
      case 'beneficiary':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = true;
        break;
    } 
  }

}
