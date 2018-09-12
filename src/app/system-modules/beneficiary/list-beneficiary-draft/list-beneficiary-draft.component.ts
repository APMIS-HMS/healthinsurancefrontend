import 'rxjs/add/operator/filter';

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import {
  CurrentPlaformShortName,
  TABLE_LIMIT_PER_VIEW
} from './../../../services/globals/config';
import {
  BeneficiaryService,
  FacilityService,
  SystemModuleService,
  UserTypeService
} from './../../../services/index';
import { PlanService } from './../../../services/plan/plan.service';
import { PolicyService } from './../../../services/policy/policy.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-beneficiary-draft',
  templateUrl: './list-beneficiary-draft.component.html',
  styleUrls: ['./list-beneficiary-draft.component.scss']
})
export class ListBeneficiaryDraftComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  beneficiaries: any[] = [];
  cachedBeneficiaries: any[] = [];
  sizeOfBeneficiaries: any[] = [];
  inActiveBeneficiaries: any[] = [];
  mainBeneficiaries: any[] = [];
  loading: boolean = true;
  planTypes: any[] = [];
  totalData: number;
  showLoadMore: Boolean = true;
  limitValue = 3;
  skipValue = 0;
  currentPlatform: any;
  user: any;
  hasCreateBeneficiary: Boolean = false;
  platformName: string;

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
    private _toastr: ToastsManager
  ) {
    this.platformName = environment.platform;
    this._router.events.filter(event => event instanceof NavigationEnd).subscribe(e => { });
    this.user = (<any>this._locker.getObject('auth')).user;

    // if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
    //   // this._getPerson();
    // }
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary Draft List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiary drafts');
    if (this.user.userType === undefined) {
      this.hasCreateBeneficiary = true;
    } else if (!!this.user.userType && this.user.userType.name !== 'Provider') {
      this.hasCreateBeneficiary = true;
    }
    this._getCurrentPlatform();
  }

  reset() {
    this.skipValue = 0;
    this.beneficiaries = [];
    this._getCurrentPlatform();
    this.showLoadMore = true;
  }

  private _getCurrentPlatform() {
    console.log(this.platformName);
    this._systemService.on();
    this._facilityService
      .find({ query: { shortName: this.platformName } })
      .then((res: any) => {
        console.log(res);
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
          // { platformOwnerNumber: { $regex: value, '$options': 'i' } },
          if (!!this.user.userType && this.user.userType.name === 'Provider') {
            this._getAllBeneficiaries(
              {
                query: {
                  'providerId._id': this.user.facilityId._id,
                  $limit: this.limitValue,
                  $skip: this.skipValue * this.limitValue,
                  $sort: { createdAt: -1 },
                  isComplete: false
                  // $select: {
                  //   'hiaId.name': 1,
                  //   principalBeneficiary: 1,
                  //   dependantBeneficiaries: 1,
                  //   isActive: 1,
                  //   providerId: 1
                  // }
                }
              },
              this.user.facilityId._id,
              this.user.userType.name
            );
          } else if (
            !!this.user.userType &&
            this.user.userType.name === 'Health Insurance Agent'
          ) {
            this._getAllBeneficiaries(
              {
                query: {
                  'hiaId._id': this.user.facilityId._id,
                  $limit: this.limitValue,
                  $skip: this.skipValue * this.limitValue,
                  $sort: { createdAt: -1 },
                  isComplete: false
                  // $select: {
                  //   'hiaId.name': 1,
                  //   principalBeneficiary: 1,
                  //   dependantBeneficiaries: 1,
                  //   isActive: 1
                  // }
                }
              },
              this.user.facilityId._id,
              this.user.userType.name
            );
          } else if (
            !!this.user.userType &&
            this.user.userType.name === 'Employer'
          ) {
            this._getAllBeneficiaries(
              {
                query: {
                  'sponsor._id': this.user.facilityId._id,
                  $limit: this.limitValue,
                  $skip: this.skipValue * this.limitValue,
                  $sort: { createdAt: -1 },
                  isComplete: false
                  // $select: {
                  //   'hiaId.name': 1,
                  //   principalBeneficiary: 1,
                  //   dependantBeneficiaries: 1,
                  //   isActive: 1
                  // }
                }
              },
              this.user.facilityId._id,
              this.user.userType.name
            );
          } else if (
            !!this.user.userType &&
            this.user.userType.name === 'Platform Owner'
          ) {
            this._getAllBeneficiaries(
              {
                query: {
                  'platformOwnerId._id': this.user.facilityId._id,
                  $limit: this.limitValue,
                  $skip: this.skipValue * this.limitValue,
                  $sort: { createdAt: -1 },
                  isComplete: false
                  // $select: {
                  //   'hiaId.name': 1,
                  //   principalBeneficiary: 1,
                  //   dependantBeneficiaries: 1,
                  //   isActive: 1
                  // }
                }
              },
              this.user.facilityId._id,
              this.user.userType.name
            );
          } else {
            this._getAllBeneficiaries(
              {
                query: {
                  'platformOwnerId._id': this.currentPlatform._id,
                  $limit: this.limitValue,
                  $skip: this.skipValue * this.limitValue,
                  $sort: { createdAt: -1 },
                  isComplete: false
                  // $select: {
                  //   'platformOwnerId.$': 1,
                  //   'hiaId.name': 1,
                  //   principalBeneficiary: 1,
                  //   dependantBeneficiaries: 1,
                  //   isActive: 1
                  // }
                }
              },
              this.user.facilityId._id,
              ''
            );
          }
        }
        this.loading = false;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
  }

  loadMoreBeneficiaries() {
    this._getCurrentPlatform();
  }

  private _getAllBeneficiaries(query, id, userType) {
    // this.beneficiaries = [];
    // this.tempBeneficiaries = [];
    console.log(query);
    try {
      this._systemService.on();
      this._beneficiaryService.find(query).then((res: any) => {
        console.log('Beneficiary ', res);
        // if (res.data.length > 0) {
        //   this.loading = false;
        //   res.data.forEach((policy, i) => {
        //     if (!!policy.principalBeneficiary) {
        //       const principal = policy.principalBeneficiary;
        //       principal.isPrincipal = true;
        //       principal.hia = policy.hiaId;
        //       principal.policyId = policy._id;
        //       principal.isActive = policy.isActive;
        //       principal.dependantCount = policy.dependantBeneficiaries.length;
        //       principal.planTypeId = policy.planTypeId;
        //       this.beneficiaries.push(principal);
        //       this.cachedBeneficiaries.push(principal);
        //       policy.dependantBeneficiaries.forEach((innerPolicy, j) => {
        //         innerPolicy.beneficiary.person =
        //           innerPolicy.beneficiary.personId;
        //         innerPolicy.beneficiary.isPrincipal = false;
        //         innerPolicy.beneficiary.principalId = principal._id;
        //         innerPolicy.beneficiary.policyId = policy._id;
        //         innerPolicy.beneficiary.hia = policy.hiaId;
        //         innerPolicy.beneficiary.isActive = policy.isActive;
        //         innerPolicy.beneficiary.planTypeId = policy.planTypeId;
        //         this.beneficiaries.push(innerPolicy.beneficiary);
        //         this.cachedBeneficiaries.push(innerPolicy.beneficiary);
        //       });
        //     }
        //   });
        // } else {
        //   this.loading = false;
        // }
        // if (!!userType && userType !== '') {
        //   this._beneficiaryService.countBenefeciaries(userType, id).then(data => {
        //       this.totalData = data.body.count;
        //       if (this.beneficiaries.length >= this.totalData) {
        //         this.showLoadMore = false;
        //       }
        //     });
        //   this.mainBeneficiaries = this.beneficiaries;
        // }
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
    this.skipValue++;
  }


  navigateDraftList() {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/beneficiaries']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
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
      this._locker.setObject('policyID', beneficiary.policyId);
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary.policyId]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._locker.setObject('policyID', beneficiary.policyId);
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries', beneficiary.policyId]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }
}
