import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService, SystemModuleService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { DURATIONS } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent implements OnInit {
  approvalFormGroup: FormGroup;
	tab_details = true;
	tab_preauthorization = false;
	tab_plans = false;
	tab_beneficiaries = false;
	tab_employers = false;
  tab_payment = false;
  tab_claims = false;
	tab_complaints = false;
  tab_referals = false;
  durations: any = DURATIONS;
  addApproval: boolean = false;
  facility: any = <any>{};
  approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';

	constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Provider Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getProviderDetails(param.id);
      }
    });

    this.approvalFormGroup = this._fb.group({
      duration: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]]
    });
  }

  private _getProviderDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {})
      .then((res: Facility) => {
        console.log(res);
        this._headerEventEmitter.setMinorRouteUrl(res.name);
        this._systemService.off();
        this.facility = res;
      }).catch(err => {
        this._systemService.off();
      });
  }

  onClickApprove(valid: boolean, value: any) {
    if (valid) {
      console.log(value);
      const validity = {
        duration: value.duration,
        unit: value.unit,
        createdAt: new Date(),
        validTill: this.addDays(new Date(), value.unit.days)
      };

      if (!!this.facility.provider.validityPeriods) {
        this.facility.provider.validityPeriods.push(validity);
      } else {
        this.facility.provider.validityPeriods = [];
        this.facility.provider.validityPeriods.push(validity);
      }

      this.facility.isConfirmed = true;
      this._facilityService.update(this.facility).then(res => {
        console.log(res);
        this.facility = res;
        const status = this.facility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
        const text = this.facility.name + ' has been ' + status;
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
    this.facility.isConfirmed = false;
    this._facilityService.update(this.facility).then(res => {
      console.log(res);
      this.facility = res;
      const status = this.facility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
      const text = this.facility.name + ' has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  navigateProviders(url, id) {
    this.loadingService.startLoading();
    if (!!id) {
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }

  tabDetails_click(){
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
  tabPreauthorization_click(){
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
  tabPlans_click(){
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
  tabBeneficiaries_click(){
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
  tabEmployers_click(){
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
  tabPayment_click(){
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
  tabClaims_click(){
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
  tabComplaints_click(){
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
  tabReferals_click(){
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
