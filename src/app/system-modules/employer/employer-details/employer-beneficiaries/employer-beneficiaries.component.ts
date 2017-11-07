
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName } from '../../../../services/globals/config';
import { SystemModuleService, FacilityService, ClaimsPaymentService, PolicyService } from '../../../../services/index';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-employer-beneficiaries',
  templateUrl: './employer-beneficiaries.component.html',
  styleUrls: ['./employer-beneficiaries.component.scss']
})
export class EmployerBeneficiariesComponent implements OnInit {
  user: any;
  currentPlatform: any;
  beneficiaries: any = <any>[];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _policyService: PolicyService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('ORGANISATION PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('All pending payments');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();
  }

  private _getPolicies() {
    console.log(this.currentPlatform);
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        isPaid: false,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      console.log(res);
      this.loading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.beneficiaries.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }


  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

}
