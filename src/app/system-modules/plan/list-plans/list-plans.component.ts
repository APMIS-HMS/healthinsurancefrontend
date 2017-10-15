import { PlanService } from './../../../services/plan/plan.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { PlanTypeService } from './../../../services/common/plan-type.service';

import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserTypeService } from '../../../services/common/user-type.service';
import { FacilityService } from '../../../services/index';

@Component({
  selector: 'app-list-plans',
  templateUrl: './list-plans.component.html',
  styleUrls: ['./list-plans.component.scss']
})
export class ListPlansComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  userTypes: any[] = [];
  planTypes: any[] = [];
  currentPlatform: any;
  user: any;
  plans: any = [];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _systemService: SystemModuleService,
    private _userTypeService: UserTypeService,
    private _planTypeService: PlanTypeService,
    private _planService: PlanService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Plan List');
    this._headerEventEmitter.setMinorRouteUrl('List of all plans');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getPlanTypes();
    this._getCurrentPlatform();
  }

  _getPlans() {
    this._systemService.on();
    this._planService.find({ query: { 'platformOwnerId._id': this.currentPlatform._id, 'facilityId._id': this.user.facilityId._id } }).then((payload: any) => {
      this.loading = false;
      this.plans = payload.data;
      console.log(this.plans)
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getPlans();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
      }
    }, error => {
      this._systemService.off();
    });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.planTypes = payload.data;
      }
    }, error => {
      this._systemService.off();
    });
  }

  getPrice(duration, plan) {
    let ret = '0.00';
    let index = plan.premiums.findIndex(x => x.unit.name === duration);
    if (index === -1) {
      return ret;
    }else{
      return plan.premiums[index].amount;
    }
  }

  navigateNewPlan() {
    this._systemService.on();
    this._router.navigate(['/modules/plan/new']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateEditPlan(plan) {
    this._systemService.on();
    this._router.navigate(['/modules/plan/new', plan._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }
  navigatePlanDetail(plan){
    this._systemService.on();
    this._router.navigate(['/modules/plan/plans', plan._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }
}
