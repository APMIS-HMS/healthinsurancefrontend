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

    // this.listsearchControl.valueChanges.subscribe(search => {
    //   this.loading = true;
    //   if (search.length > 2) {
    //     const query = {
    //       platformOwnerId: this.currentPlatform._id,
    //       isComplete: false,
    //       search: search
    //     };
    //     this._policyService.searchPolicy(query).then((res: any) => {
    //         this.loading = false;
    //         this._systemService.off();
    //         if (res.data.length > 0) {
    //           this.beneficiaries = res.data;
    //         }
    //       }).catch(err => { });
    //   } else {
    //     // If There is no search, replace the beneficiaries with the cached data.
    //     this.beneficiaries = this.cachedBeneficiaries;
    //     this._systemService.off();
    //   }
    // });
  }

  reset() {
    this.skipValue = 0;
    this.beneficiaries = [];
    this._getCurrentPlatform();
    this.showLoadMore = true;
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService
      .find({ query: { shortName: this.platformName } })
      .then((res: any) => {
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
    try {
      this._systemService.on();
      this._beneficiaryService.find(query).then((res: any) => {
        this._systemService.off();
        this.loading = false;
        if (res.data.length > 0) {
          this.beneficiaries = res.data;
          this.cachedBeneficiaries = res.data;
        }

        if (!!userType && userType !== '') {
          this._beneficiaryService.countBenefeciaries(userType, id).then(data => {
              this.totalData = data.body.count;
              if (this.beneficiaries.length >= this.totalData) {
                this.showLoadMore = false;
              }
            });
          this.mainBeneficiaries = this.beneficiaries;
        }
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
}
