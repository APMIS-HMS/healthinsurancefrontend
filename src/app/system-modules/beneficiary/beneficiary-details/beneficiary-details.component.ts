import { UploadService } from './../../../services/common/upload.service';
import { Observable } from 'rxjs/Observable';
import { PolicyService } from './../../../services/policy/policy.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FacilityService, SystemModuleService, BeneficiaryService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {
  beneficiary: any;
  policy:any;
  tab_details = true;
  tab_payment = false;
  tab_claims = false;
  tab_complaints = false;
  tab_referals = false;
  tab_checkin = false;

  dependants:any[] = [];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService:UploadService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getBeneficiaryDetails(param.id);
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
      if(results[1].data.length > 0){
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

  navigateBeneficiary(url, id) {
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
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
  }
  tabPayment_click() {
    this.tab_details = false;
    this.tab_payment = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_referals = false;
    this.tab_checkin = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = true;
    this.tab_checkin = false;
  }
  tabCheckin_click() {
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_checkin = true;
  }

}
