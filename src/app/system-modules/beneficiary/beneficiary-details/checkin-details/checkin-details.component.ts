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
  selectedCheckIn: any;
  user: any;

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
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    console.log(this.beneficiary)
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    this.otpFormGroup = this._fb.group({
      patient: ['', [<any>Validators.required]],
      otp: ['', [<any>Validators.required]]
    });
    this.checkinFormGroup = this._fb.group({
      encounterType: ['', [<any>Validators.required]],
      encounterDate: ['', [<any>Validators.required]]
    });
    this.checkedinFormGroup = this._fb.group({
      encounterType: ['', [<any>Validators.required]],
      encounterDate: ['', [<any>Validators.required]],
      encounterStatus: ['', [<any>Validators.required]]
    });

    this._getClaimStatuses();
    this._getClaimTypes();
    this._getEncounterStatuses();
    this._getEncounterTypes();
  }

  otp_verify() {
    this.otp_show = false;
    this.checkin_show = true;
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
    if(model.principalBeneficiaryId === model.beneficiaryId){
      model.otp.phoneNumbers = ['08028217639'];
    }

    this._checkInService.create(model).then(payload =>{
      console.log(payload);
      this._systemService.off();
      this.otp_generated = true;
    }).catch(err =>{
      console.log(err);
      this._systemService.off();
      this._toastr.error('Error(s) occured while generting token, please try again!!!', 'Token Error');
    })
  }
  checkin_click() {
    this.checkinSect = false;
    this.checkedinSect = true;
  }
  getAge() {
    return differenceInYears(
      new Date(),
      this.beneficiary.person.dateOfBirth
    )
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

}
