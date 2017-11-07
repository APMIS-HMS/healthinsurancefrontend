import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { SystemModuleService, FacilityService, ClaimsPaymentService, PolicyService } from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-pending-payments',
  templateUrl: './pending-payments.component.html',
  styleUrls: ['./pending-payments.component.scss']
})
export class PendingPaymentsComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  employer = new FormControl();
  dateRange = new FormControl();
  individualActiveTab: boolean = true;
  organisationActiveTab: boolean = false;
  user: any;
  currentPlatform: any;
  openBatchModal: boolean = false;
  individualLoading: boolean = true;
  organisationLoading: boolean = true;
  individualPolicies: any = [];
  organisationPolicies: any = [];

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

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
    this._headerEventEmitter.setRouteUrl('PREMIUM PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('Pending payments for both individuals and organizations');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();
  }

  private _getIndividualPolicies() {
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
      this.individualLoading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.individualPolicies.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getOrganisationPolicies() {
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
      this.organisationLoading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.organisationPolicies.push(policy);
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
        this._getIndividualPolicies();
        this._getOrganisationPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }


  onCheckAllToPay() {
    console.log('Selecteed pay');
  }

  onCheckSelectedToPay(index: number, policy: any) {
    if (!policy.isChecked) {
      policy.isChecked = true;
      policy.isQueuedForPayment = true;
      // this.selectedFFSClaims.push(claim);
    } else {
      // Remove from the selected Claim
      console.log(index);
      policy.isChecked = false;
      policy.isQueuedForPayment = false;
      // if (this.selectedFFSClaims.length > 0) {
      //   this.selectedFFSClaims.splice(index, 1);
      // }
    }
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

  onClickOpenBatchModal() {
    this.openBatchModal = true;
  }

  modal_close() {
    this.openBatchModal = false;
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.off();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

}
