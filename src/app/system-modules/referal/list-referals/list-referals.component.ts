import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';

import {environment} from '../../../../environments/environment';

import {SystemModuleService} from './../../../services/common/system-module.service';
import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';
import {TABLE_LIMIT_PER_VIEW} from './../../../services/globals/config';
import {ReferralService} from './../../../services/referral/referral.service';

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
  loading: boolean = true;

  authorizations: any[] = [];
  user: any;

  totalEntries: number;
  showLoadMore: any = true;
  limit: number = TABLE_LIMIT_PER_VIEW;
  resetData: Boolean;
  index: number = 0;
  platformName: any;

  constructor(
      private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService,
      private _referralService: ReferralService,
      private _locker: CoolLocalStorage) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Referral List');
    this._headerEventEmitter.setMinorRouteUrl('All Referrals');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getReferrals();
  }

  _getReferrals() {
    if (!!this.user.userType && this.user.userType.name === 'Provider') {
      this._systemService.on();
      this._referralService
          .find({
            query: {
              $or: [
                {'referingProvider._id': this.user.facilityId._id},
                {'destinationProvider._id': this.user.facilityId._id}, {
                  'documentation.destinationProvider._id':
                      this.user.facilityId._id
                }
              ],
              $sort: {createdAt: -1},
              $limit: this.limit,
              $skip: this.limit * this.index
            }
          })
          .then((payload: any) => {
            this.loading = false;
            // this.authorizations = payload.data;
            this.totalEntries = payload.total;
            if (this.resetData !== true) {
              this.authorizations.push(...payload.data)
            } else {
              this.resetData = false;
              this.authorizations = payload.data;
            }
            if (this.authorizations.length >= this.totalEntries) {
              this.showLoadMore = false;
            }
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else if (
        !!this.user.userType &&
        this.user.userType.name === 'Health Insurance Agent') {
      this._systemService.on();
      this._referralService
          .find({
            query: {
              $or: [{'policyId.hiaId._id': this.user.facilityId._id}],
              $limit: this.limit,
              $skip: this.limit * this.index
            }
          })
          .then((payload: any) => {
            this.loading = false;
            // this.authorizations = payload.data;
            this.totalEntries = payload.total;
            if (this.resetData !== true) {
              this.authorizations.push(...payload.data)
            } else {
              this.resetData = false;
              this.authorizations = payload.data;
            }

            if (this.authorizations.length >= this.totalEntries) {
              this.showLoadMore = false;
            }
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this.loading = false;
    }
    this.index++;
  }

  navigateDetail(auth) {
    this._router.navigate(['/modules/referal/referals', auth._id])
        .then(
            payload => {

            })
        .catch(err => {});
  }

  loadMore() {
    this._getReferrals();
  }

  reset() {
    this.index = 0;
    this.resetData = true;
    this._getReferrals();
    this.showLoadMore = true;
  }
}
