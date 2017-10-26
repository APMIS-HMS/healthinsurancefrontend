import { ReferralService } from './../../../services/referral/referral.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  selectedAuthorization: any;
  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService:SystemModuleService,
    private _referralService:ReferralService,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getAuthorizationDetails(param.id);
      }
    });
   }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Referral Details');
    this._headerEventEmitter.setMinorRouteUrl('Details');
  }
  _getAuthorizationDetails(id) {
    this._systemService.on();
    this._referralService.get(id, {}).then(payload => {
      this._systemService.off();
      this.selectedAuthorization = payload;
      this.tab_details = true;
    }).catch(err => {
      this._systemService.off();
    });
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
    if (!!id && id !== '') {
     this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
     this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

}
