import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
    private _locker: CoolLocalStorage,
    private _toastr: ToastsManager,
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
      this.beneficiaries = this.mainBeneficiaries;
      if (value === 'All') {
        this.beneficiaries = this.mainBeneficiaries;
      } else {
        let temp = this.beneficiaries.filter(x => x.planTypeId._id === value._id);
        this.beneficiaries = temp;
      }
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
        this.currentPlatform = res.data[0];

        if (!!this.user.userType && this.user.userType.name === 'Provider') {
          this._getAllPolicies({
            query: {
              'providerId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'providerId.$': 1, 'hiaId.name':1, 'principalBeneficiary':1, 'dependantBeneficiaries':1, 'isActive':1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Health Insurance Agent') {
          this._getAllPolicies({
            query: {
              'hiaId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'hiaId.$': 1, 'hiaId.name':1, 'principalBeneficiary':1, 'dependantBeneficiaries':1, 'isActive':1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Employer') {
          this._getAllPolicies({
            query: {
              'employerId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'employerId.$': 1, 'hiaId.name':1, 'principalBeneficiary':1, 'dependantBeneficiaries':1, 'isActive':1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Platform Owner') {
          this._getAllPolicies({
            query: {
              'platformOwnerId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'platformOwnerId.$': 1, 'hiaId.name':1, 'principalBeneficiary':1, 'dependantBeneficiaries':1, 'isActive':1 }
            }
          });
        } else {
          this._getAllPolicies({
            query: {
              'platformOwnerId._id': this.currentPlatform._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'platformOwnerId.$': 1, 'hiaId.name':1, 'principalBeneficiary':1, 'dependantBeneficiaries':1, 'isActive':1 }
            }
          });
        }
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getAllPolicies(query) {
    try {
      this._systemService.on();
      this._policyService.find(query).then((res: any) => {
        this.loading = false;
        if (res.data.length > 0) {
          console.log(1)
          res.data.forEach(policy => {
            console.log(2)
            let principal = policy.principalBeneficiary;
            principal.isPrincipal = true;
            principal.hia = policy.hiaId;
            principal.isActive = policy.isActive;
            principal.dependantCount = policy.dependantBeneficiaries.length;
            principal.planTypeId = policy.planTypeId;
            this.beneficiaries.push(principal);
            policy.dependantBeneficiaries.forEach(innerPolicy => {
              console.log(3)
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
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this._systemService.off();
        this._toastr.error('Error has occured please contact your administrator!', 'Error!');
      });
    } catch (error) {
      this.loading = false;
      this._toastr.error('Error has occured please contact your administrator!', 'Error!');
    }
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
