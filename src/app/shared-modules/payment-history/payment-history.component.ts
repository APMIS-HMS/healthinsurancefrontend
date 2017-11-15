import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from '../../services/globals/config';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { Beneficiary } from '../../models/setup/beneficiary';
import {
  SystemModuleService, UserTypeService, BeneficiaryService, PlanTypeService, UploadService, FacilityService, PlanService, PolicyService
} from '../../services/index';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  policies: any = [];
  user: any;
  routeId: string;
  currentPlatform: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _policyService: PolicyService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Payment History');
    this._headerEventEmitter.setMinorRouteUrl('Payment history for beneficiary');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();

    this._route.params.subscribe(param => {
      console.log(param);
      if (param.id !== undefined) {
        this.routeId = param.id;
      }
    });
  }

  private _getPolicies() {
    console.log(this.currentPlatform);
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        'sponsor._id': this.routeId,
        isPaid: true,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      console.log(res);
      this.loading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.policies.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find(
      { query: { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] } }
    ).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }

}
