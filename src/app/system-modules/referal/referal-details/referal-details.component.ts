import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-referal-details',
  templateUrl: './referal-details.component.html',
  styleUrls: ['./referal-details.component.scss']
})
export class ReferalDetailsComponent implements OnInit {

  tab_details = true;
  tab_claims = false;
  tab_complaints = false;

  constructor(
    private _router: Router,
    private loadingService: LoadingBarService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService:SystemModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Referral Details');
    this._headerEventEmitter.setMinorRouteUrl('Details');
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_claims = false;
    this.tab_complaints = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_claims = true;
    this.tab_complaints = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_claims = false;
    this.tab_complaints = true;
  }

  navigate(url: string, id?: string) {
    if (!!id) {
     this._systemService.on()
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
     this._systemService.on()
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

}
