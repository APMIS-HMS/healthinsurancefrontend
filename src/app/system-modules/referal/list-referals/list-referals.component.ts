import { CoolLocalStorage } from 'angular2-cool-storage';
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
  user:any;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _referralService: ReferralService,
    private _locker:CoolLocalStorage
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Referral List');
    this._headerEventEmitter.setMinorRouteUrl('All Referrals');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getReferrals();
  }
  _getReferrals() {
   
    if(this.user.userType.name === 'Provider'){
      this._systemService.on();
      this._referralService.find({
        query:{
          $or: [
            { 'referingProvider._id': this.user.facilityId._id },
            { 'destinationProvider._id':this.user.facilityId._id },
            { 'documentation.destinationProvider._id':this.user.facilityId._id }
          ]
        }
      }).then((payload: any) => {
        this.authorizations = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }else if(this.user.userType.name === 'Health Insurance Agent'){
      console.log(this.user.facilityId._id)
      this._systemService.on();
      this._referralService.find({
        query:{
          $or: [
            { 'policyId.hiaId._id': this.user.facilityId._id }
          ]
        }
      }).then((payload: any) => {
        this.authorizations = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }

  }
  
  navigateDetail(auth) {
    this._router.navigate(['/modules/referal/referals', auth._id]).then(payload =>{

    }).catch(err =>{
      console.log(err)
    })
  }
}
