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
  hasCreateBeneficiary: Boolean = false;

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
    this.user = (<any>this._locker.getObject('auth')).user;

    if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
      console.log(this.user)
      this._getPerson();
    }
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');

    console.log(this.user);
    // Check if user has the role to create beneficiary
    if (this.user.userType === undefined) {
      this.hasCreateBeneficiary = true;
    } else if (!!this.user.userType && this.user.userType.name !== 'Provider') {
      this.hasCreateBeneficiary = true;
    }

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
  _getPerson() {
    if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
      let beneficiary$ = Observable.fromPromise(this._beneficiaryService.find({
        query: {
          'personId.email': this.user.email
        }
      }));
      Observable.forkJoin([beneficiary$]).subscribe((results: any) => {
        console.log(results)
        if (results[0].data.length > 0) {
          this._policyService.find({
            query: {
              principalBeneficiary: results[0].data[0]._id,
            }
          }).then((policies: any) => {
            console.log(policies)
            if (policies.data.length > 0) {
              this._router.navigate(['/modules/beneficiary/beneficiaries', policies.data[0]._id]).then(payload => {

              }).catch(err => {
                console.log(err)
              });
            }
          }).catch(errin => {
            console.log(errin)
          })
        }
      }, error => {
        console.log(error);
      })
    }

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
              $select: { 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Health Insurance Agent') {
          this._getAllPolicies({
            query: {
              'hiaId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Employer') {
          this._getAllPolicies({
            query: {
              'employerId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Platform Owner') {
          this._getAllPolicies({
            query: {
              'platformOwnerId._id': this.user.facilityId._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'platformOwnerId.$': 1, 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
            }
          });
        } else {
          this._getAllPolicies({
            query: {
              'platformOwnerId._id': this.currentPlatform._id,
              $limit: 200,
              $sort: { createdAt: -1 },
              $select: { 'platformOwnerId.$': 1, 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
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
          res.data.forEach(policy => {
            let principal = policy.principalBeneficiary;
            principal.isPrincipal = true;
            principal.hia = policy.hiaId;
            principal.policyId = policy._id;
            principal.isActive = policy.isActive;
            principal.dependantCount = policy.dependantBeneficiaries.length;
            principal.planTypeId = policy.planTypeId;
            this.beneficiaries.push(principal);
            policy.dependantBeneficiaries.forEach(innerPolicy => {
              innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
              innerPolicy.beneficiary.isPrincipal = false;
              innerPolicy.beneficiary.principalId = principal._id;
              innerPolicy.beneficiary.policyId = policy._id;
              innerPolicy.beneficiary.hia = policy.hiaId;
              innerPolicy.beneficiary.isActive = policy.isActive;
              innerPolicy.beneficiary.planTypeId = policy.planTypeId;
              this.beneficiaries.push(innerPolicy.beneficiary);
            });
          });
        }
        this.mainBeneficiaries = this.beneficiaries;
        this._systemService.off();
        this.loading = false;
      }).catch(err => {
        console.log(err)
        this.loading = false;
        this._systemService.off();
        this._toastr.error('Error has occured please contact your administrator!', 'Error!');
      });
    } catch (error) {
      console.log(error)
      this.loading = false;
      this._toastr.error('Error has occured please contact your administrator!', 'Error!');
    }
  }


  private _getInActiveBeneficiaries(platformId) {
    this._systemService.on();
    let policy$ = Observable.fromPromise(this._policyService.find({ 'platformOwnerId._id': platformId, isActive: true }));
    let benefic$ = Observable.fromPromise(this._beneficiaryService.find({ 'platformOwnerId._id': platformId }));

    Observable.forkJoin([policy$, benefic$]).subscribe((results: any) => {
      let beneficiaryList: any[] = results[1].data;
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
    })
  }

  navigateNewBeneficiary() {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new/principal']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateEditBeneficiary(beneficiary) {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/new/principal', beneficiary._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateDetailBeneficiary(beneficiary) {
    if (beneficiary.isPrincipal) {
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary.policyId]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary.policyId]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }

  }


}
