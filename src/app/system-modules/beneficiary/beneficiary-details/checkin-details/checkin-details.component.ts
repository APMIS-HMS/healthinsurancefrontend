import { PolicyService } from './../../../../services/policy/policy.service';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UploadService } from './../../../../services/common/upload.service';
import { CheckIn } from './../../../../models/check-in/check-in';
import { CheckInService } from './../../../../services/common/check-in.service';
import { EncounterStatusService } from './../../../../services/common/encounter-status.service';
import { EncounterTypeService } from './../../../../services/common/encounter-type.service';
import { ClaimStatusService } from './../../../../services/common/claim-status.service';
import { ClaimTypeService } from './../../../../services/common/claim-type.service';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';
import differenceInYears from 'date-fns/difference_in_years';

@Component({
  selector: 'app-checkin-details',
  templateUrl: './checkin-details.component.html',
  styleUrls: ['./checkin-details.component.scss']
})
export class CheckinDetailsComponent implements OnInit {
  @Input() beneficiary;
  otpFormGroup: FormGroup;
  checkinFormGroup: FormGroup;
  checkedinFormGroup: FormGroup;

  otp_show = true;
  checkin_show = false;
  otp_generated = false;
  checkinSect = true;
  checkedinSect = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  claimTypes: any[] = [];
  claimStatuses: any[] = [];
  encounterTypes: any[] = [];
  encounterStatuses: any[] = [];

  selectedClaimType: any;
  selectedClaimStatus: any;
  selectedEncounterType: any;
  selectedEncounterStatus: any;
  selectedCheckIn: CheckIn;
  user: any;
  hasCheckInToday = false;

  constructor(private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _claimTypeService: ClaimTypeService,
    private _claimStatusService: ClaimStatusService,
    private _encounterTypeService: EncounterTypeService,
    private _encounterStatusService: EncounterStatusService,
    private _checkInService: CheckInService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage,
    private _route: ActivatedRoute,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._route.parent.params.subscribe(params => {
      this._getBeneficiaryDetails(params.id);
    });
    this.today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
    this.hasCheckInToday = false;
    this.user = (<any>this._locker.getObject('auth')).user;
    this.otpFormGroup = this._fb.group({
      patient: ['', [<any>Validators.required]],
      otp: ['', [<any>Validators.required]]
    });

    this._initializedForm();
    this._getClaimStatuses();
    this._getClaimTypes();
    this._getEncounterStatuses();
    this._getEncounterTypes();

    // this._hasCheckInToday();

  }
  private _getBeneficiaryDetails(routeId) {
    this._systemService.on();

    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.get(routeId, {}));
    let policy$ = Observable.fromPromise(this._policyService.find({
      query:
      {
        $or: [
          { principalBeneficiary: routeId },
          { 'dependantBeneficiaries.beneficiary._id': routeId },
        ]
      }
    }));

    // query: {
    //   $or: [
    //     { platformOwnerNumber: { $regex: value, '$options': 'i' } },
    //     { 'personId.lastName': { $regex: value, '$options': 'i' } },
    //     { 'personId.firstName': { $regex: value, '$options': 'i' } },
    //   ]
    // }

    Observable.forkJoin([beneficiary$, policy$]).subscribe((results: any) => {
      this._headerEventEmitter.setMinorRouteUrl(results[0].name);
      this.beneficiary = results[0];
      console.log(results)
      // if (this.isCheckIn) {
      //   this.tabCheckin_click();
      // }
      this._hasCheckInToday();

      if (results[1].data.length > 0) {
        // this.dependants = results[1].data[0].dependantBeneficiaries;
        // this.policy = results[1].data[0];
        // console.log(this.dependants)
        // console.log(this.policy)
      }

      this._systemService.off();
    }, error => {
      this._systemService.off();
    });
  }
  _initializedForm() {
    if (this.selectedCheckIn !== undefined && this.selectedCheckIn._id !== undefined) {
      this.today = {
        year: new Date(this.selectedCheckIn.encounterDateTime).getFullYear(),
        month: new Date(this.selectedCheckIn.encounterDateTime).getMonth() + 1,
        day: new Date(this.selectedCheckIn.encounterDateTime).getDate()
      }
    } else {
      this.today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }
    this.checkinFormGroup = this._fb.group({
      encounterType: [this.selectedCheckIn != null ? this.selectedCheckIn.encounterType : '', [<any>Validators.required]],
      encounterDate: [this.selectedCheckIn != null ? this.selectedCheckIn.encounterDateTime : this.today, [<any>Validators.required]]
    });
    this.checkedinFormGroup = this._fb.group({
      encounterType: [this.selectedCheckIn != null ? this.selectedCheckIn.encounterType : '', [<any>Validators.required]],
      encounterDate: [this.selectedCheckIn != null ? this.selectedCheckIn.encounterDateTime : this.today, [<any>Validators.required]],
      encounterStatus: [this.selectedCheckIn != null ? this.selectedCheckIn.encounterStatus : '', [<any>Validators.required]]
    });
  }

  otp_verify() {
    console.log(this.beneficiary._id);
    this._systemService.on();
    this._checkInService.find({
      query: {
        beneficiaryId: this.beneficiary._id,
        'otp.number': this.otpFormGroup.controls['otp'].value,
        'otp.isVerified': false,
        $client: {
          verify: true
        }
      }
    }).then((payload: any) => {
      console.log(payload)
      if (payload.data !== undefined) {
        this.otp_show = false;
        this.checkin_show = true;
        this._initializedForm();
        console.log('in')
      } else {
        this._toastr.warning('Invalid or expired OTP supplied, check and try again', 'OTP');
      }
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    })
  }
  ok_click() {
    this.otp_generated = false;
  }
  generate_otp() {
    this._systemService.on();
    let model: CheckIn = <CheckIn>{};
    model.beneficiaryId = this.beneficiary._id;
    model.claimStatus = this.selectedClaimStatus;
    model.claimType = this.selectedClaimType;
    model.encounterDateTime = new Date();
    model.encounterStatus = this.selectedEncounterStatus;
    model.encounterType = this.selectedEncounterType;
    model.platformOwnerId = this.user.platformOwnerId;
    model.principalBeneficiaryId = this.beneficiary._id;
    model.providerFacilityId = this.user.facilityId;
    model.otp = {};
    if (model.principalBeneficiaryId === model.beneficiaryId) {
      model.otp.phoneNumbers = [this.beneficiary.personId.phoneNumber];
    }

    this._checkInService.create(model).then((payload: any) => {
      this._systemService.off();
      this.selectedCheckIn = payload;
      this.otp_generated = true;
    }).catch(err => {
      console.log(err);
      this._systemService.off();
      this._toastr.error('Error(s) occured while generting token, please try again!!!', 'Token Error');
    });
  }
  checkin_click() {
    this._systemService.on();
    this.selectedCheckIn.encounterType = this.checkinFormGroup.controls['encounterType'].value;
    this.selectedCheckIn.encounterDateTime = this.checkinFormGroup.controls['encounterDate'].value.jsdate;
    this._checkInService.patch(this.selectedCheckIn._id, this.selectedCheckIn, {
      $client: {
        confirmation: true
      }
    })
      .then((payload: any) => {
        if (payload !== undefined) {
          this.checkinSect = false;
          this.checkedinSect = true;
          this.selectedCheckIn = payload;
          this._initializedForm();
        }
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      })
  }
  getAge() {
    return differenceInYears(
      new Date(),
      this.beneficiary.personId.dateOfBirth
    )
  }
  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }

  _hasCheckInToday() {
    this._systemService.on();
    this._checkInService.find({
      query: {
        beneficiaryId: this.beneficiary._id,
        $client: {
          hasCheckInToday: false
        }
      }
    }).then((payload: any) => {
      if (payload.data.length > 0) {
        this.hasCheckInToday = true;
        this.selectedCheckIn = payload.data[0];
        if (this.selectedCheckIn.confirmation !== undefined) {
          this._initializedForm();
          this.checkinSect = false;
          this.checkedinSect = true;
        } else if (this.selectedCheckIn.otp.isVerified) {
          this._initializedForm();
          this.otp_show = false;
          this.checkin_show = true;
        }

      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }


  _getClaimTypes() {
    this._systemService.on();
    this._claimTypeService.find({}).then((payload: any) => {
      this.claimTypes = payload.data;
      this.selectedClaimType = this.claimTypes[0];
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getClaimStatuses() {
    this._systemService.on();
    this._claimStatusService.find({}).then((payload: any) => {
      this.claimStatuses = payload.data;
      this.selectedClaimStatus = this.claimStatuses[1];
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getEncounterTypes() {
    this._systemService.on();
    this._encounterTypeService.find({}).then((payload: any) => {
      this.encounterTypes = payload.data;
      this.selectedEncounterType = this.encounterTypes[1];
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getEncounterStatuses() {
    this._systemService.on();
    this._encounterStatusService.find({}).then((payload: any) => {
      this.encounterStatuses = payload.data;
      this.selectedEncounterStatus = this.encounterStatuses[1];
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  otp_regenerate() {
    this.selectedCheckIn = undefined;
  }

  navigateToNewClaim() {
    this._systemService.on();
    this._router.navigate(['/modules/claim/new', this.selectedCheckIn._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }
  navigateToNewAuthorization() {
    this._systemService.on();
    this._router.navigate(['/modules/pre-auth/new', this.selectedCheckIn._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  navigateToNewReferal() {
    this._systemService.on();
    this._router.navigate(['/modules/referal/new', this.selectedCheckIn._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

}
