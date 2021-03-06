import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';

import {environment} from '../../../../environments/environment';
import {FacilityService} from '../../../services';

import {SystemModuleService} from './../../../services/common/system-module.service';
import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';
import {TABLE_LIMIT_PER_VIEW} from './../../../services/globals/config';
import {PreAuthorizationService} from './../../../services/pre-authorization/pre-authorization.service';

@Component({
  selector: 'app-pre-authorization-list',
  templateUrl: './pre-authorization-list.component.html',
  styleUrls: ['./pre-authorization-list.component.scss']
})
export class PreAuthorizationListComponent implements OnInit {
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
  currentPlatform: any;

  constructor(
      private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService,
      private _preAuthorizationService: PreAuthorizationService,
      private _facilityService: FacilityService,
      private _locker: CoolLocalStorage) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._headerEventEmitter.setRouteUrl('Pre-Authorization List');
    this._headerEventEmitter.setMinorRouteUrl('All pre-authorizations');
    this._getCurrentPlatform();
  }
  private _getCurrentPlatform() {
    this._facilityService
        .findWithOutAuth({query: {shortName: this.platformName}})
        .then(res => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
            this._getPreAuthorizations();
          }
        })
        .catch(err => {});
  }
  _getPreAuthorizations() {
    if (this.user.userType.name === 'Provider') {
    }
    this._systemService.on();
    this._preAuthorizationService
        .find({
          query: {
            platformOwnerId: this.currentPlatform._id,
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
            this.authorizations.push(...payload.data);
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
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this._systemService.on();
      this._router.navigate([url])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    }
  }

  navigateDetail(auth) {
    this._router.navigate(['/modules/pre-auth/pre-authorizations', auth._id])
        .then(payload => {})
        .catch(err => {});
  }

  loadMore() {
    this._getPreAuthorizations();
  }

  reset() {
    this.index = 0;
    this.resetData = true;
    this._getPreAuthorizations();
    this.showLoadMore = true;
  }
}
