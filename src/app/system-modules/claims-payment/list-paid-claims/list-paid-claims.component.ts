import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable, Subscription} from 'rxjs/Rx';

import {environment} from '../../../../environments/environment';
import {Claim} from '../../../models/index';
import {BeneficiaryService, CapitationFeeService, ClaimService, ClaimsPaymentService, FacilityService, PolicyService, SystemModuleService, UserTypeService} from '../../../services/index';

import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';
import {TABLE_LIMIT_PER_VIEW} from './../../../services/globals/config';

@Component({
  selector: 'app-list-paid-claims',
  templateUrl: './list-paid-claims.component.html',
  styleUrls: ['./list-paid-claims.component.scss']
})
export class ListPaidClaimsComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  user: any;
  currentPlatform: any;
  claims: any = [];
  loading: boolean = true;
  showClaimsLoadMore: any = true;
  limit: number = TABLE_LIMIT_PER_VIEW;
  claimsResetData: Boolean;
  index: number = 0;
  claimsTotalEntries: any;
  platformName: string;

  constructor(
      private _router: Router,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService,
      private _facilityService: FacilityService,
      private _locker: CoolLocalStorage,
      private _claimsPaymentService: ClaimsPaymentService,
      private _claimService: ClaimService,
  ) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Paid Claims');
    this._headerEventEmitter.setMinorRouteUrl('list Paid Claims');
    this.user = (<any>this._locker.getObject('auth')).user;

    this._getCurrentPlatform();
  }

  private _getPaidClaims() {
    this._systemService.on();
    this._claimsPaymentService
        .find({
          query: {
            'platformOwnerId._id': this.currentPlatform._id,
            'paidByType._id': this.user.userType._id,
            $limit: this.limit,
            $skip: this.limit * this.index
          }
        })
        .then((res: any) => {
          this.loading = false;
          this.claims = res.data;
          this._systemService.off();
        })
        .catch(error => {
          this._systemService.off();
        });
  }

  private _getCurrentPlatform() {
    this._facilityService
        .find({
          query: {
            shortName: this.platformName,
            $select: ['name', 'shortName', 'address.state']
          }
        })
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
            this._getPaidClaims();
          }
        })
        .catch(err => {});
  }

  navigate(url: string, id?: string) {
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

  claimsReset() {
    this.index = 0;
    this.claimsResetData = true;
    this._getPaidClaims();
    this.showClaimsLoadMore = true;
  }
}
