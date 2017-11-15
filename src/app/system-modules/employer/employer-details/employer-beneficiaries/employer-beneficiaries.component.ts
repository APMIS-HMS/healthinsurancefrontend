
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName } from '../../../../services/globals/config';
import { SystemModuleService, FacilityService, ClaimsPaymentService, PolicyService } from '../../../../services/index';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-employer-beneficiaries',
  templateUrl: './employer-beneficiaries.component.html',
  styleUrls: ['./employer-beneficiaries.component.scss']
})
export class EmployerBeneficiariesComponent implements OnInit {
  mainBeneficiaries: any;
  user: any;
  currentPlatform: any;
  beneficiaries: any = <any>[];
  loading: boolean = true;
  hiaResult = false;
  isEdit = false;

  nameControl = new FormControl();
  genderControl = new FormControl('Male');
  typeControl = new FormControl('P');
  idControl = new FormControl();
  dobControl = new FormControl();
  lgaControl = new FormControl();
  hiaControl = new FormControl();
  statusControl = new FormControl('Active');

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _policyService: PolicyService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('ORGANISATION PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('All pending payments');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();

    this._route.params.subscribe(param => {
      console.log(param)
      if (param.id !== undefined) {
        this._getFacility(param.id);
      }
    })
  }
  private _getFacility(id) {
    this._facilityService.get(id, {}).then(payload => {
      console.log(payload)
      this.applyQuery(payload);
    }).catch(error => {
      console.log(error);
    })
  }
  private _getAllPolicies(query) {
    try {
      this._systemService.on();
      this._policyService.find(query).then((res: any) => {
        this.loading = false;
        console.log(res)
        if (res.data.length > 0) {
          res.data.forEach(policy => {
            let principal = policy.principalBeneficiary;
            principal.isPrincipal = true;
            principal.hia = policy.hiaId;
            principal.policyId = policy._id;
            principal.isActive = policy.isActive;
            principal.dependantCount = policy.dependantBeneficiaries.length;
            principal.planTypeId = policy.planTypeId;
            principal.policy = policy;
            this.beneficiaries.push(principal);
            policy.dependantBeneficiaries.forEach(innerPolicy => {
              innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
              innerPolicy.beneficiary.isPrincipal = false;
              innerPolicy.beneficiary.principalId = principal._id;
              innerPolicy.beneficiary.policyId = policy._id;
              innerPolicy.beneficiary.policy = policy;
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
        console.log(this.mainBeneficiaries)
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

  private applyQuery(facility) {
    console.log(facility)
    if (facility !== undefined) {
      console.log(1)
      // { platformOwnerNumber: { $regex: value, '$options': 'i' } },
      if (facility.facilityType !== undefined && facility.facilityType.name === 'Provider') {
        console.log(2)
        this._getAllPolicies({
          query: {
            'sponsor._id': facility._id,
            $limit: 200,
            $sort: { createdAt: -1 },
            $select: { 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1, 'providerId': 1 }
          }
        });
      } else if (facility.facilityType !== undefined && facility.facilityType.name === 'Employer') {
        console.log('employer')
        this._getAllPolicies({
          query: {
            'sponsor._id': facility._id,
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
            $select: { 'hiaId.name': 1, 'principalBeneficiary': 1, 'dependantBeneficiaries': 1, 'isActive': 1 }
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
  }

  private _getPolicies() {
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        isPaid: false,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      this.loading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.beneficiaries.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }


  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  editRow() {
    this.isEdit = !this.isEdit;
  }
  navigateDetailBeneficiary() {

  }
}
