import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

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

  constructor(
    private _router: Router,
    private loadingService: LoadingBarService,
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Platform Details');
    this._headerEventEmitter.setMinorRouteUrl('Details');
  }

  navigateToPlatforms() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/platform/platforms']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
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
