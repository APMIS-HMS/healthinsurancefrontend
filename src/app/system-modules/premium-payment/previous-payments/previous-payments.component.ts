
import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {environment} from '../../../../environments/environment';
import {ClaimsPaymentService, FacilityService, PolicyService, SystemModuleService, UserTypeService} from '../../../services/index';

import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-previous-payments',
  templateUrl: './previous-payments.component.html',
  styleUrls: ['./previous-payments.component.scss']
})
export class PreviousPaymentsComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  organization = new FormControl();
  dateRange = new FormControl();
  individualActiveTab: boolean = true;
  organisationActiveTab: boolean = false;
  user: any;
  currentPlatform: any;
  individualLoading: boolean = true;
  individualPolicies: any = <any>[];


  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;
  platformName: any;


  constructor(
      private _router: Router, private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService,
      private _facilityService: FacilityService,
      private _userTypeService: UserTypeService,
      private _locker: CoolLocalStorage,
      private _policyService: PolicyService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('PREMIUM PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('Previous Payments');
    this.user = (<any>this._locker.getObject('auth')).user;

    this._getCurrentPlatform();
  }

  private _getPolicies() {
    console.log(this.currentPlatform);
    this._systemService.on();
    this._policyService
        .find({
          query: {
            'platformOwnerId._id': this.currentPlatform._id,
            isPaid: true,
            $sort: {createdAt: -1}
          }
        })
        .then((res: any) => {
          console.log(res);
          this.individualLoading = false;
          res.data.forEach(policy => {
            policy.dueDate =
                this.addDays(new Date(), policy.premiumPackageId.durationInDay);
            this.individualPolicies.push(policy);
          });
          this._systemService.off();
        })
        .catch(error => {
          console.log(error);
          this._systemService.off();
        });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString();  // .toISOString();
  }


  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({query: {shortName: this.platformName}})
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
            this._getPolicies();
          }
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }



  onClickTab(tabName: string) {
    if (tabName === 'individualPayment') {
      this.individualActiveTab = true;
      this.organisationActiveTab = false;
    } else {
      this.individualActiveTab = false;
      this.organisationActiveTab = true;
    }
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
}
