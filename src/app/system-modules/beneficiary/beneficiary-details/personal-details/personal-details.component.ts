import { Facility } from './../../../../models/organisation/facility';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    this._headerEventEmitter.setRouteUrl('Beneficiary Details');
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
  }
  private _getBeneficiaryDetails(routeId) {
    this._systemService.on();

    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.get(routeId, {}));
    let policy$ = Observable.fromPromise(this._policyService.find({ query: { 'principalBeneficiary': routeId } }));

    Observable.forkJoin([beneficiary$, policy$]).subscribe((results: any) => {
      console.log(results);
      this.beneficiary = results[0];
      if (this.isCheckIn) {
        this.tabCheckin_click();
      }

      if (results[1].data.length > 0) {
        this._headerEventEmitter.setMinorRouteUrl('Household: ' + results[1].data[0].policyId);
        this.dependants = results[1].data[0].dependantBeneficiaries;
        this.policy = results[1].data[0];
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

  onClickApprove() {
      // const validity = {
      //   duration: value.duration,
      //   unit: value.unit,
      //   startDate: value.startDate,
      //   createdAt: new Date(),
      //   validTill: this.addDays(new Date(), value.unit.days)
      // };
      // if (!!this.policy.validityPeriods) {
      //   this.policy.validityPeriods.push(validity);
      // } else {
      //   this.policy.validityPeriods = [];
      //   this.policy.validityPeriods.push(validity);
      // }

      this.policy.isActive = !this.policy.isActive;
      this._policyService.update(this.policy).then((res: any) => {
        this.policy = res;
        const status = this.policy.isActive ? 'activated successfully' : 'deactivated successfully';
        const text = 'Policy has been ' + status;
        this._toastr.success(text, 'Confirmation!');
        // Send sms to Principal Beneficiary
        // const smsData = {
        //   content: 'Policy has been activated.',
        //   sender: 'LASHMA',
        //   receiver: '08056679920'
        // };

        // this._facilityService.sendSMSWithMiddleWare(smsData).then((payload: any) => {
        // }).catch(err => console.log(err));
        setTimeout(e => {
          this.addApprovalClick();
        }, 1000);
      }).catch(err => {
        console.log(err);
      });
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
  navigateEditBeneficiary(beneficiary) {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new', beneficiary._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }

  navigateFacility(sponsor){
    console.log(sponsor)
    if(sponsor.facilityType.name === 'Provider'){
      this._router.navigate(['/modules/provider/providers', sponsor._id]);
    } else if(sponsor.facilityType.name === 'Employer'){
      this._router.navigate(['/modules/employer/employers', sponsor._id]);
    } else if(sponsor.facilityType.name === 'Health Insurance Agent'){
      this._router.navigate(['/modules/hia/hias', sponsor._id]);
    }else if(sponsor.facilityType.name === 'Platform Owner'){
      this._router.navigate(['/modules/provider/new', sponsor._id]);
    }
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
