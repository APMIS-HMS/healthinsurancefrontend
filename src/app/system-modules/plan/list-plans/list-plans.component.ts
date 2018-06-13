import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';

import {UserTypeService} from '../../../services/common/user-type.service';
import {FacilityService} from '../../../services/index';

import {AuthService} from './../../../auth/services/auth.service';
import {PlanTypeService} from './../../../services/common/plan-type.service';
import {SystemModuleService} from './../../../services/common/system-module.service';
import {UploadService} from './../../../services/common/upload.service';
import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';
import {CurrentPlaformShortName, TABLE_LIMIT_PER_VIEW} from './../../../services/globals/config';
import {PlanService} from './../../../services/plan/plan.service';

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
  totalEntries: number;
  showLoadMore: any = true;
  limit: number = TABLE_LIMIT_PER_VIEW;
  resetData: Boolean;
  index: number = 0;

  constructor(
      private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _authService: AuthService,
      private _systemService: SystemModuleService,
      private _userTypeService: UserTypeService,
      private _planTypeService: PlanTypeService,
      private _planService: PlanService,
      private _facilityService: FacilityService,
      private _locker: CoolLocalStorage) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Plan List');
    this._headerEventEmitter.setMinorRouteUrl('List of all plans');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getPlanTypes();
    this._getCurrentPlatform();
  }

  _getPlans() {
    this._systemService.on();
    this._planService
        .find({
          query: {
            'platformOwnerId._id': this.currentPlatform._id,
            $or: [
              {'facilityId._id': this.user.facilityId._id},
              {'facilityId._id': this.currentPlatform._id}
            ],
            $limit: this.limit,
            $skip: this.limit * this.index
          }
        })
        .then((payload: any) => {
          this.loading = false;
          // this.plans = payload.data;
          this.totalEntries = payload.total;
          if (this.resetData !== true) {
            this.plans.push(...payload.data);
          } else {
            this.resetData = false;
            this.plans = payload.data;
          }
          if (this.plans.length >= this.totalEntries) {
            this.showLoadMore = false;
          }
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    this.index++;
  }

  _getCurrentPlatform() {
    this._facilityService
        .findWithOutAuth({query: {shortName: CurrentPlaformShortName}})
        .then(res => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
            this._getPlans();
          }
        })
        .catch(err => {});
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then(
        (payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            this.userTypes = payload.data;
          }
        },
        error => {
          this._systemService.off();
        });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.find({}).then(
        (payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            this.planTypes = payload.data;
          }
        },
        error => {
          this._systemService.off();
        });
  }

  getPrice(duration, plan) {
    let ret = '0.00';
    let index = plan.premiums.findIndex(x => x.unit.name === duration);
    if (index === -1) {
      return ret;
    } else {
      return plan.premiums[index].amount;
    }
  }

  navigateNewPlan() {
    this._systemService.on();
    this._router.navigate(['/modules/plan/new'])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  navigateEditPlan(plan) {
    this._systemService.on();
    this._router.navigate(['/modules/plan/new', plan._id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }
  navigatePlanDetail(plan) {
    this._systemService.on();
    this._router.navigate(['/modules/plan/plans', plan._id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  loadMore() {
    this._getCurrentPlatform();
  }

  reset() {
    this.index = 0;
    this.resetData = true;
    this._getCurrentPlatform();
    this.showLoadMore = true;
  }
}
