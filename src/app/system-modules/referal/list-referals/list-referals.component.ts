import { ReferralService } from './../../../services/referral/referral.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-referals',
  templateUrl: './list-referals.component.html',
  styleUrls: ['./list-referals.component.scss']
})
export class ListReferalsComponent implements OnInit {

  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();

  authorizations:any[] = [];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _referralService: ReferralService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Referral List');
    this._headerEventEmitter.setMinorRouteUrl('All Referrals');
    this._getReferrals();
  }
  _getReferrals() {
    this._systemService.on();
    this._referralService.find({}).then((payload: any) => {
      console.log(payload.data)
      this.authorizations = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  
  navigateDetail(auth) {
    this._router.navigate(['/modules/referal/referals', auth._id]).then(payload =>{

    }).catch(err =>{
      console.log(err)
    })
  }
}
