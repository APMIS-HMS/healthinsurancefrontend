import { PlanService } from './../../../services/plan/plan.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
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
  beneficiaries: any[] = [];
  inActiveBeneficiaries: any[] = [];
  mainBeneficiaries: any[] = [];
  loading: boolean = true;
  planTypes: any[] = [];
  currentPlatform: any;
  user: any;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _planService: PlanService,
    private _locker: CoolLocalStorage
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
      });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');
    this.user = (<any>this._locker.getObject('auth')).user;
    // this._userTypeService.find({}).then(payload => {
    //   // console.log(payload);
    // });

    // this._getBeneficiaries();
    this._getPlans();
    this._getCurrentPlatform();

    this.statusControl.valueChanges.subscribe((value) => {
      if (value === 'All') {
        this.beneficiaries = this.mainBeneficiaries;
      } else {
        let temp = this.beneficiaries.filter(x => x.isActive === (value == 'true') ? true : false);
        this.beneficiaries = temp;
      }
    });

    this.filterTypeControl.valueChanges.subscribe((value) => {
      // console.log(value)
      // console.log(this.beneficiaries);
      this.beneficiaries = this.mainBeneficiaries;
      if (value === 'All') {
        this.beneficiaries = this.mainBeneficiaries;
      } else {
        let temp = this.beneficiaries.filter(x => x.planTypeId._id === value._id);
        this.beneficiaries = temp;
      }
      console.log(this.beneficiaries)
    });
  }
  reset() {
    this.ngOnInit();
  }
  private _getPlans() {
    this._planService.find({}).then((payload: any) => {
      this.planTypes = payload.data;
    }).catch(err => {

    })
  }
  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        console.log(res);
        this.currentPlatform = res.data[0];
        console.log(this.user);

        if (!!this.user.userType && this.user.userType.name === 'Provider') {
          this._getBeneficiariesFromPolicyByProvider(this.user.facilityId._id);
        } else if (!!this.user.userType && this.user.userType.name === 'Health Insurance Agent') {
          this._getBeneficiariesFromPolicyByHIA(this.user.facilityId._id);
        } else if (!!this.user.userType && this.user.userType.name === 'Platform Owner') {
          this._getBeneficiariesFromPolicy(this.user.facilityId._id);
        } else {
          this.loading = false;
          this.beneficiaries = [];
        }
        // this._getBeneficiariesFromPolicy(this.currentPlatform._id);  
        // this._getInActiveBeneficiaries(this.currentPlatform._id);
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getBeneficiariesFromPolicy(platformId) {
    console.log(platformId);
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': platformId,
        $limit: 200,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      this.loading = false;
      if (res.data.length > 0) {
        res.data.forEach(policy => {
          let principal = policy.principalBeneficiary;
          principal.isPrincipal = true;
          principal.hia = policy.hiaId;
          principal.isActive = policy.isActive;
          principal.dependantCount = policy.dependantBeneficiaries.length;
          principal.planTypeId = policy.planTypeId;
          this.beneficiaries.push(principal);
          policy.dependantBeneficiaries.forEach(innerPolicy => {
            innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
            innerPolicy.beneficiary.isPrincipal = false;
            innerPolicy.beneficiary.principalId = principal._id;
            innerPolicy.beneficiary.hia = policy.hiaId;
            innerPolicy.beneficiary.isActive = policy.isActive;
            innerPolicy.beneficiary.planTypeId = policy.planTypeId;
            this.beneficiaries.push(innerPolicy.beneficiary);
          });
          console.log(this.beneficiaries);
        });
      }
      this.mainBeneficiaries = this.beneficiaries;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getBeneficiariesFromPolicyByProvider(providerId) {
    console.log(providerId);
    this._systemService.on();
    this._policyService.find({
      query: {
        'providerId._id': providerId,
        $limit: 200,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      this.loading = false;
      if (res.data.length > 0) {
        res.data.forEach(policy => {
          let principal = policy.principalBeneficiary;
          principal.isPrincipal = true;
          principal.hia = policy.hiaId;
          principal.isActive = policy.isActive;
          principal.dependantCount = policy.dependantBeneficiaries.length;
          principal.planTypeId = policy.planTypeId;
          this.beneficiaries.push(principal);
          policy.dependantBeneficiaries.forEach(innerPolicy => {
            innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
            innerPolicy.beneficiary.isPrincipal = false;
            innerPolicy.beneficiary.principalId = principal._id;
            innerPolicy.beneficiary.hia = policy.hiaId;
            innerPolicy.beneficiary.isActive = policy.isActive;
            innerPolicy.beneficiary.planTypeId = policy.planTypeId;
            this.beneficiaries.push(innerPolicy.beneficiary);
          });

        });
        console.log(this.beneficiaries);
      }
      this.mainBeneficiaries = this.beneficiaries;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getBeneficiariesFromPolicyByHIA(providerId) {
    console.log(providerId);
    this._systemService.on();
    this._policyService.find({
      query: {
        'hiaId._id': providerId,
        $limit: 200,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      this.loading = false;
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
            innerPolicy.beneficiary.principalId = principal._id;
            innerPolicy.beneficiary.hia = policy.hiaId;
            innerPolicy.beneficiary.isActive = policy.isActive;
            this.beneficiaries.push(innerPolicy.beneficiary);
          });
        });
        console.log(this.beneficiaries);
      }
      this.mainBeneficiaries = this.beneficiaries;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getInActiveBeneficiaries(platformId) {
    console.log(platformId)
    this._systemService.on();
    let policy$ = Observable.fromPromise(this._policyService.find({ 'platformOwnerId._id': platformId, isActive: true }));
    let benefic$ = Observable.fromPromise(this._beneficiaryService.find({ 'platformOwnerId._id': platformId }));

    Observable.forkJoin([policy$, benefic$]).subscribe((results: any) => {
      let beneficiaryList: any[] = results[1].data;
      console.log(results)
      results[0].data.forEach(policy => {
        let principal = policy.principalBeneficiary;
        const index = beneficiaryList.findIndex(x => x._id === principal._id);
        if (index > -1) {
          beneficiaryList.splice(index);
        }
        policy.dependantBeneficiaries.forEach(innerPolicy => {
          const index = beneficiaryList.findIndex(x => x._id === innerPolicy.beneficiary._id);
          if (index > -1) {
            beneficiaryList.splice(index);
          }
        })
      })
      this.inActiveBeneficiaries = beneficiaryList;
      this._systemService.off();
    }, error => {
      console.log(error)
    })
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
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new', beneficiary._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }

  navigateDetailBeneficiary(beneficiary) {
    console.log(beneficiary)
    if (beneficiary.isPrincipal) {
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary._id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err)
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary.principalId]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err)
        this._systemService.off();
      });
    }

  }


}
