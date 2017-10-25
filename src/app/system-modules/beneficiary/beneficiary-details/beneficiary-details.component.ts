import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  tab_details = true;
  tab_payment = false;
  tab_claims = false;
  tab_complaints = false;
  tab_referals = false;
  tab_checkin = false;
  tab_checkinHistory = false;
  addApproval: boolean = false;
  approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';
  durations: any = DURATIONS;
  dependants: any[] = [];
  isCheckIn = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this._route.params.subscribe(param => {
      if (!!param.id) {
        this._getBeneficiaryDetails(param.id);
      }
    });

    this.approvalFormGroup = this._fb.group({
      duration: [1, [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      startDate: [new Date(), [<any>Validators.required]]
    });

    this._route.data.subscribe(data => {
      if (!!data.goCheckIn && data.goCheckIn) {
        this.isCheckIn = true;
        this.tab_payment = false;
        this.tab_details = false;
        this.tab_claims = false;
        this.tab_complaints = false;
        this.tab_referals = false;
        this.tab_checkinHistory = false;
      }
    });

    this._route.data.subscribe(data => {
      if (!!data.goPayment && data.goPayment) {
        this.tab_payment = true;
        this.isCheckIn = false;
        this.tab_details = false;
        this.tab_claims = false;
        this.tab_complaints = false;
        this.tab_referals = false;
        this.tab_checkinHistory = false;
      }
    });
  }

  private _getBeneficiaryDetails(routeId) {
    this._systemService.on();

    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.get(routeId, {}));
    let policy$ = Observable.fromPromise(this._policyService.find({ query: { 'principalBeneficiary._id': routeId } }));

    Observable.forkJoin([beneficiary$, policy$]).subscribe((results: any) => {
      this._headerEventEmitter.setMinorRouteUrl(results[0].name);
      this.beneficiary = results[0];
      if (this.isCheckIn) {
        this.tabCheckin_click();
      }

      if (results[1].data.length > 0) {
        this.dependants = results[1].data[0].dependantBeneficiaries;
        this.policy = results[1].data[0];
        console.log(this.dependants)
        console.log(this.policy)
      }

      this._systemService.off();
    }, error => {
      this._systemService.off();
    });
  }

  onClickApprove(valid: boolean, value: any) {
    if (valid) {
      const validity = {
        duration: value.duration,
        unit: value.unit,
        startDate: value.startDate,
        createdAt: new Date(),
        validTill: this.addDays(new Date(), value.unit.days)
      };

      if (!!this.policy.validityPeriods) {
        this.policy.validityPeriods.push(validity);
      } else {
        this.policy.validityPeriods = [];
        this.policy.validityPeriods.push(validity);
      }

      this.policy.isActive = true;
      this._policyService.update(this.policy).then((res: any) => {
        console.log(res);
        this.policy = res;
        const status = this.policy.isActive ? 'activated successfully' : 'deactivated successfully';
        const text = 'Policy has been ' + status;
        this._toastr.success(text, 'Confirmation!');
        // Send sms to Principal Beneficiary
        const smsData = {
          content: 'Testing beneficiary',
          sender: 'Me',
          receiver: '08056679920'
        };

        this._facilityService.sendSMSWithMiddleWare(smsData).then((payload: any) => {
          console.log(res);
        }).catch(err => console.log(err));

        setTimeout(e => {
          this.addApprovalClick();
        }, 1000);
      });
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
      console.log(res);
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
    console.log(this.beneficiary);
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
    this.tab_details = true;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    this.tab_checkinHistory = false;
  }
  tabPayment_click() {
    this.tab_details = false;
    this.tab_payment = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    this.tab_checkinHistory = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    this.tab_checkinHistory = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_referals = false;
    this.tab_checkin = false;
    this.tab_checkinHistory = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = true;
    this.tab_checkin = false;
    this.tab_checkinHistory = false;
  }
  tabCheckin_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = true;
    this.tab_checkinHistory = false;
  }
  tabCheckinDetail_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
    this.tab_checkinHistory = true;
  }

}
