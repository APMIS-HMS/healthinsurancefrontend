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
      this.loadingService.startLoading();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }

}
