import { Observable } from 'rxjs/Rx';
import { Beneficiary } from './../../../models/setup/beneficiary';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { PolicyService } from './../../../services/policy/policy.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, BeneficiaryService, PlanTypeService, UploadService, FacilityService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-beneficiary',
  templateUrl: './list-beneficiary.component.html',
  styleUrls: ['./list-beneficiary.component.scss']
})
export class ListBeneficiaryComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  beneficiaries: any = <any>[];
  loading: Boolean = true;
  planTypes: any[] = [];
  currentPlatform: any;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
      });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');

    this._userTypeService.find({}).then(payload => {
      // console.log(payload);
    });

    // this._getBeneficiaries();
    this._getCurrentPlatform();
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this.getBeneficiariesFromPolicy(this.currentPlatform._id);
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  getBeneficiariesFromPolicy(platformId) {
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': platformId
      }
    }).then((res: any) => {
      console.log(res);
      if (res.data.length > 0) {
        res.data.forEach(policy => {
          let principal = policy.principalBeneficiary;
          principal.isPrincipal = true;
          principal.hia = policy.hiaId;
          principal.isActive = policy.isActive;
          principal.dependantCount = policy.dependantBeneficiaries.length;
          this.beneficiaries.push(principal);
          policy.dependantBeneficiaries.forEach(innerPolicy => {
            innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
            innerPolicy.beneficiary.isPrincipal = false;
            innerPolicy.beneficiary.hia = policy.hiaId;
            innerPolicy.beneficiary.isActive = policy.isActive;
            this.beneficiaries.push(innerPolicy.beneficiary);
          })
        })
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  private _getInActiveBeneficiaries(platformId) {

    let policy$ = Observable.fromPromise(this._beneficiaryService.find({ 'platformOwnerId._id': platformId }));
    let benefic$ = Observable.fromPromise(this._beneficiaryService.find({ 'platformOwnerId._id': platformId }));
    this._systemService.on();
    this._beneficiaryService.find({
      'platformOwnerId._id': platformId
    }).then((res: any) => {
      this.loading = false;
      if (res.data.length > 0) {
        this.beneficiaries = res.data;
        console.log(this.beneficiaries);
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  navigateNewPlatform() {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateEditBeneficiary(beneficiary) {
    console.log(beneficiary)
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new', beneficiary._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }


}
