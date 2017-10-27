import { Facility } from './../../../../models/organisation/facility';
import { DURATIONS } from './../../../../services/globals/config';
import { Observable } from 'rxjs/Observable';
import { UploadService } from './../../../../services/common/upload.service';
import { PolicyService } from './../../../../services/policy/policy.service';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { FacilityService } from '../../../../services/index';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  @Input() beneficiary;

  approvalFormGroup: FormGroup;
  policy: any;
  tab_details = false;
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
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(param => {
      if (!!param.id) {
        this._getBeneficiaryDetails(param.id);
      }
    });
  }
  private _getBeneficiaryDetails(routeId) {
    this._systemService.on();

    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.get(routeId, {}));
    let policy$ = Observable.fromPromise(this._policyService.find({ query: { 'principalBeneficiary': routeId } }));

    Observable.forkJoin([beneficiary$, policy$]).subscribe((results: any) => {
      this._headerEventEmitter.setMinorRouteUrl(results[0].name);
      this.beneficiary = results[0];
      if (this.isCheckIn) {
        this.tabCheckin_click();
      }

      if (results[1].data.length > 0) {
        this.dependants = results[1].data[0].dependantBeneficiaries;
        this.policy = results[1].data[0];
        console.log(this.policy);
        console.log(this.dependants)
        console.log(this.policy)
      }

      this._systemService.off();
    }, error => {
      this._systemService.off();
    });
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
  openModal(e) {
    this.addApproval = true;
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
}
