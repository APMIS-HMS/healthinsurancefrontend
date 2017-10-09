import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FacilityService, SystemModuleService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss']
})
export class EmployerDetailsComponent implements OnInit {
	tab_details = true;
	tab_preauthorization = false;
	tab_plans = false;
	tab_beneficiaries = false;
	tab_employers = false;
  tab_payment = false;
  tab_claims = false;
	tab_complaints = false;
	tab_referals = false;
  facility: any = <any>{};

	constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Employer Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getEmployerDetails(param.id);
      }
    });
  }

  private _getEmployerDetails(routeId) {
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

  navigateEmployers(url, id) {
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
