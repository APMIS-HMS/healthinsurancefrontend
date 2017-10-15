import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DURATIONS } from '../../../services/globals/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { Facility } from './../../../models/organisation/facility';
import { FacilityService } from '../../../services/index';

@Component({
  selector: 'app-hia-details',
  templateUrl: './hia-details.component.html',
  styleUrls: ['./hia-details.component.scss']
})
export class HiaDetailsComponent implements OnInit {
  approvalFormGroup: FormGroup;

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  
  selectedFacility: Facility = <Facility>{};
  addApproval: boolean = false;
  approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';
  durations: any = DURATIONS;

  tab_details = true;
  tab_preauthorization = false;
  tab_plans = false;
  tab_beneficiaries = false;
  tab_employers = false;
  tab_payment = false;
  tab_claims = false;
  tab_complaints = false;
  tab_referals = false;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getHIADetails(param.id);
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
        createdAt: new Date(),
        validTill: this.addDays(new Date(), value.unit.days)
      };

      if (!!this.selectedFacility.hia.validityPeriods) {
        this.selectedFacility.hia.validityPeriods.push(validity);
      } else {
        this.selectedFacility.hia.validityPeriods = [];
        this.selectedFacility.hia.validityPeriods.push(validity);
      }

      this.selectedFacility.isConfirmed = true;
      this._facilityService.update(this.selectedFacility).then((res: Facility) => {
        console.log(res);
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
      console.log(res);
      this.selectedFacility = res;
      const status = this.selectedFacility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
      const text = this.selectedFacility.name + ' has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  _getHIADetails(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((payload: any) => {
      this.selectedFacility = payload;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateEditHIA(hia) {
    this._systemService.on();
    this._router.navigate(['/modules/hia/new', hia._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }

  openModal(e) {
    this.addApproval = true;
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabPreauthorization_click() {
    this.tab_details = false;
    this.tab_preauthorization = true;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabPlans_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = true;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabBeneficiaries_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = true;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabEmployers_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = true;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabPayment_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_referals = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = true;
  }

}
