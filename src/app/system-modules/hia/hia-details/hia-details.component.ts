import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DURATIONS } from '../../../services/globals/config';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService, FacilityService } from './../../../services/index';
import { Facility } from './../../../models/organisation/facility';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-hia-details',
  templateUrl: './hia-details.component.html',
  styleUrls: ['./hia-details.component.scss']
})
export class HiaDetailsComponent implements OnInit {
  approvalFormGroup: FormGroup;

  // listsearchControl = new FormControl();
  // filterTypeControl = new FormControl('All');
  // createdByControl = new FormControl();
  // utilizedByControl = new FormControl();
  // statusControl = new FormControl('All');

  selectedFacility: Facility = <Facility>{};
  addApproval: boolean = false;
  // approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';
  durations: any = DURATIONS;
  tabDetails = true;
  tabPreauthorization = false;
  tabPlans = false;
  tabBeneficiaries = false;
  tabEmployers = false;
  tabPayment = false;
  tabClaims = false;
  tabComplaints = false;
  tabReferrals = false;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    // private _uploadService: UploadService,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService
  ) { }

  ngOnInit() {
    let url = this._router.url;
    this._route.params.subscribe(param => {
      if (!!param.id) {
        console.log(param);
        this._getHIADetails(param.id, url);
      }
    });

    this.approvalFormGroup = this._fb.group({
      duration: [1, [<any>Validators.required]],
      unit: ['', [<any>Validators.required]]
    });
   }

  onClickApprove(valid: boolean, value: any) {
    if (valid) {
      const validity = {
        duration: value.duration,
        unit: value.unit,
        isActive: true,
        createdAt: new Date(),
        validTill: this.addDays(new Date(), value.unit.days)
      };

      if (this.selectedFacility.hia.validityPeriods.length > 0) {
        this.selectedFacility.hia.validityPeriods[this.selectedFacility.hia.validityPeriods.length - 1].isActive = false;
        this.selectedFacility.hia.validityPeriods.push(validity);
      } else {
        this.selectedFacility.hia.validityPeriods = [];
        this.selectedFacility.hia.validityPeriods.push(validity);
      }

      this.selectedFacility.isConfirmed = true;
      this._facilityService.update(this.selectedFacility).then((res: Facility) => {
        this.selectedFacility = res;
        const status = this.selectedFacility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
        const text = this.selectedFacility.name + ' has been ' + status;
        this._toastr.success(text, 'Confirmation!');
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
    this.selectedFacility.isConfirmed = false;
    this._facilityService.update(this.selectedFacility).then((res: Facility) => {
      this.selectedFacility = res;
      const status = this.selectedFacility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
      const text = this.selectedFacility.name + ' has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  _getHIADetails(id, url) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((res: any) => {
      console.log(res);
      this.selectedFacility = res;
      this.routeCondition(url);
      this._headerEventEmitter.setMinorRouteUrl(this.selectedFacility.name);
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  openModal(e) {
    this.addApproval = true;
  }

  routeCondition(url) {
    if (url.includes('plans')) {
      this.tabMenuClick('plans');
    } else if (url.includes('beneficiaries')) {
      this.tabMenuClick('beneficiaries');
    } else if (url.includes('pre-authorizations')) {
      this.tabMenuClick('pre-authorizations');
    } else if (url.includes('claims')) {
      this.tabMenuClick('claims');
    } else if (url.includes('complaints')) {
      this.tabMenuClick('complaints');
    } else if (url.includes('referrals')) {
      this.tabMenuClick('referrals');
    } else if (url.includes('payments')) {
      this.tabMenuClick('payments');
    } else if (url.includes('organizations')) {
      this.tabMenuClick('organizations');
    } else {
      this.tabMenuClick('details');
    }
  }

  tabMenuClick(menu) {
    this._systemService.on();
    switch (menu) {
      case 'details':
      this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id]);
        this.tabDetails = true;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'plans':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/plans']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = true;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'pre-authorizations':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/pre-authorizations']);
        this.tabDetails = false;
        this.tabPreauthorization = true;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'beneficiaries':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/beneficiaries']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = true;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'organizations':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/organizations']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = true;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'payments':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/payments']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = true;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'complaints':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/complaints']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = true;
        this.tabClaims = false;
        this.tabReferrals = false;
        break;
      case 'claims':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/claims']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = true;
        this.tabReferrals = false;
        break;
      case 'referrals':
        this._router.navigate(['/modules/hia/hias/' + this.selectedFacility._id + '/referrals']);
        this.tabDetails = false;
        this.tabPreauthorization = false;
        this.tabPlans = false;
        this.tabBeneficiaries = false;
        this.tabEmployers = false;
        this.tabPayment = false;
        this.tabComplaints = false;
        this.tabClaims = false;
        this.tabReferrals = true;
        break;
    }
    this._systemService.off();
  }

}
