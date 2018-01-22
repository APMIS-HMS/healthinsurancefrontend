import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
import { DURATIONS } from '../../../services/globals/config';
import { FacilityService, SystemModuleService, BeneficiaryService, PolicyService, UploadService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {
  approvalFormGroup: FormGroup;
  beneficiary: any;
  policy: any;
  mobilemenu = false;
  tab_details = false;
  tab_payment = false;
  tab_claims = false;
  tab_complaints = false;
  tab_referals = false;
  tab_checkin = false;
  tab_checkinHistory = false;
  tab_checkinGenerate = false;
  addApproval: boolean = false;
  approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';
  durations: any = DURATIONS;
  dependants: any[] = [];
  isCheckIn = false;
  isHistory = false;
  isGenerate = false;
  paramId: any;
  paramcId: any;
  user: any;
  isBeneficiary = false;
  tabTitle = "Personal Details";

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage
  ) {
    this._router.events.subscribe((routerEvent: Event) => {
      this._checkRouterEvent(routerEvent);
    })
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');
    this.user = (<any>this._locker.getObject('auth')).user;

    if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
      this.isBeneficiary = true;
    }

    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        this.paramId = param.id;
        this.paramcId = param.cid;
        this._getBeneficiaryDetails(param.id);
      }
    });
  }
  private _checkRouterEvent(event: Event) {
    if (event instanceof NavigationEnd) {
      console.log('fire')
      if (this._router.url.endsWith('checkin')) {
        this.tab_checkinGenerate = false;
        this.tab_checkinHistory = false;
        this.tab_checkin = true;
        this.isCheckIn = true;
      } else if (this._router.url.endsWith('payment')) {
        this.tab_payment = true;
        this.isCheckIn = false;
      } else if (this._router.url.endsWith('claims')) {
        this.tab_claims = true;
        this.isCheckIn = false;
      } else if (this._router.url.endsWith('checkedin-history')) {
        this.tab_checkinHistory = true;
        this.tab_checkinGenerate = false;
        this.tab_checkin = false;
        this.isCheckIn = true;
        this.isHistory = true;
        this.isGenerate = false;
      } else if (this._router.url.endsWith('checkin-generate')) {
        this.tab_checkinGenerate = true;
        this.tab_checkin = false;
        this.tab_checkinHistory = false;
        this.isCheckIn = true;
        this.isHistory = false;
        this.isGenerate = true;
      }
      else if (this._router.url.endsWith('referrals')) {
        this.tab_referals = true;
        this.isCheckIn = false;
      } else {
        this.tab_details = true;
        this.isCheckIn = false;
      }
    }
  }

  private _getBeneficiaryDetails(routeId) {
    this._systemService.on();

    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.get(routeId, {}));
    let policy$ = Observable.fromPromise(this._policyService.find({ query: { 'principalBeneficiary._id': routeId } }));

    Observable.forkJoin([beneficiary$, policy$]).subscribe((results: any) => {
      this._headerEventEmitter.setMinorRouteUrl(results[0].name);
      this.beneficiary = results[0];
      if (this.isCheckIn && !this.isHistory && !this.isGenerate) {
        this.tabCheckin_click();
      }

      if (results[1].data.length > 0) {
        this.dependants = results[1].data[0].dependantBeneficiaries;
        this.policy = results[1].data[0];
      }

      this._systemService.off();
    }, error => {
      this._systemService.off();
    });
  }

  onClickApprove(valid: boolean, value: any) {
    console.log(this.policy);
    if (valid) {
      // if (this.policy.isPaid) {
      //   const validity = {
      //     duration: value.duration,
      //     unit: value.unit,
      //     startDate: value.startDate,
      //     createdAt: new Date(),
      //     validTill: this.addDays(new Date(), value.unit.days)
      //   };

      //   if (!!this.policy.validityPeriods) {
      //     this.policy.validityPeriods.push(validity);
      //   } else {
      //     this.policy.validityPeriods = [];
      //     this.policy.validityPeriods.push(validity);
      //   }

      //   this.policy.isActive = true;
      //   this._policyService.update(this.policy).then((res: any) => {
      //     this.policy = res;
      //     const status = this.policy.isActive ? 'activated successfully' : 'deactivated successfully';
      //     const text = 'Policy has been ' + status;
      //     this._toastr.success(text, 'Confirmation!');
      //     // Send sms to Principal Beneficiary
      //     const smsData = {
      //       content: 'Testing beneficiary',
      //       sender: 'Me',
      //       receiver: '08056679920'
      //     };

      //     this._facilityService.sendSMSWithMiddleWare(smsData).then((payload: any) => {
      //     }).catch(err => console.log(err));

      //     setTimeout(e => {
      //       this.addApprovalClick();
      //     }, 1000);
      //   });
      // } else {
      //   this._toastr.error('Policy has not been paid for. Please pay for policy before you can active!', 'Payment Error!');
      // }
    } else {
      this._toastr.error('Some fields are empty. Please fill in all required fields!', 'Form Validation Error!');
    }
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  onClickDeactivate() {
    this.policy.isActive = false;
    this._policyService.update(this.policy).then((res: Facility) => {
      this.beneficiary = res;
      const status = this.policy.isActive ? 'activated successfully' : 'deactivated successfully';
      const text = 'Policy has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  openModal(e) {
    this.addApproval = true;
  }

  navigateBeneficiary(url, id?) {
    this._systemService.on()
    if (!!id) {
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }


  tabDetails_click() {
    if (!this.isCheckIn) {
      this.tab_details = true;
      this.tab_payment = false;
      this.tab_claims = false;
      this.tab_complaints = false;
      this.tab_referals = false;
      this.tab_checkin = false;
      this.tab_checkinHistory = false;
      this.tab_checkinGenerate = false;
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId]);
    }
    this.tabTitle = "Personal Details";
  }
  tabPayment_click() {
    if (!this.isCheckIn) {
      this.tab_details = false;
      this.tab_payment = true;
      this.tab_claims = false;
      this.tab_complaints = false;
      this.tab_referals = false;
      this.tab_checkin = false;
      this.tab_checkinHistory = false;
      this.tab_checkinGenerate = false;
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId + '/payment']);
    }
    this.tabTitle = "Payment History";
  }
  tabClaims_click() {
    if (!this.isCheckIn) {
      this.tab_details = false;
      this.tab_payment = false;
      this.tab_claims = true;
      this.tab_complaints = false;
      this.tab_referals = false;
      this.tab_checkin = false;
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId + '/claims'])
      this.tab_checkinHistory = false;
      this.tab_checkinGenerate = false;
    }
    this.tabTitle = "Claims";
  }
  tabComplaints_click() {
    if (!this.isCheckIn) {
      this.tab_details = false;
      this.tab_payment = false;
      this.tab_claims = false;
      this.tab_complaints = true;
      this.tab_referals = false;
      this.tab_checkin = false;
      this.tab_checkinHistory = false;
      this.tab_checkinGenerate = false;
    }
    this.tabTitle = "Complaints";
  }
  tabReferals_click() {
    if (!this.isCheckIn) {
      this.tab_details = false;
      this.tab_payment = false;
      this.tab_claims = false;
      this.tab_complaints = false;
      this.tab_referals = true;
      this.tab_checkin = false;
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId + '/referrals']);
      this.tab_checkinHistory = false;
      this.tab_checkinGenerate = false;
    }
    this.tabTitle = "Referals";
  }
  tabCheckin_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = true;
    // const path = '/modules/beneficiary/beneficiaries/' + check.beneficiaryId + '/' + check._id + '/checkin';
    this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId + '/' + this.paramcId + '/checkin'])
    this.tab_checkinHistory = false;
    this.tab_checkinGenerate = false;
    this.tabTitle = "Check In";
  }
  tabCheckinGenerate_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    console.log('/modules/beneficiary/beneficiaries/' + this.paramId + '/' + this.paramcId + '/checkin-generate');
    this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId + '/' + this.paramcId + '/checkin-generate'])
    this.tab_checkinHistory = false;
    this.tab_checkinGenerate = true;
    this.tabTitle = "Check In - Generate";
  }
  tabCheckinDetail_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    this._router.navigate(['/modules/beneficiary/beneficiaries/' + this.paramId +'/' + this.paramId + '/checkedin-history'])
    this.tab_checkinHistory = true;
    this.tab_checkinGenerate = false;
    this.tabTitle = "Check In history";
  }
  mobilemenu_toggle() {
    this.mobilemenu = !this.mobilemenu;
  }

}
