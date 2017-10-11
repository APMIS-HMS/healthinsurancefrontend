import { PremiumTypeService } from './../../../../services/common/premium-type.service';
import { PlanService } from './../../../../services/plan/plan.service';
import { PlanTypeService } from './../../../../services/common/plan-type.service';
import { RelationshipService } from './../../../../services/common/relationship.service';
import { MaritalStatusService } from './../../../../services/common/marital-status.service';
import { TitleService } from './../../../../services/common/titles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GenderService } from './../../../../services/common/gender.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName } from '../../../../services/globals/config';
import { UserTypeService, BankService, CountryService, FacilityService, SystemModuleService, UploadService } from '../../../../services/index';


const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-beneficiary-program',
  templateUrl: './new-beneficiary-program.component.html',
  styleUrls: ['./new-beneficiary-program.component.scss']
})
export class NewBeneficiaryProgramComponent implements OnInit {

  frmProgram: FormGroup;
  currentPlatform: any;
  hias: any[] = [];
  providers: any[] = [];
  planTypes: any[] = [];
  plans:any[] = [];
  premiumTypes:any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _genderService: GenderService,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _titleService: TitleService,
    private _router: Router,
    private _maritalService: MaritalStatusService,
    private _relationshipService: RelationshipService,
    private _planTypeService: PlanTypeService,
    private _planService:PlanService,
    private _premiumTypeService:PremiumTypeService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.frmProgram = this._fb.group({
      hiaName: [''],
      programType: ['', [<any>Validators.required]],
      policy: ['', [<any>Validators.required]],
      programName: ['', [<any>Validators.required]],
      providerName: ['', [<any>Validators.required]]
    });

    this.frmProgram.controls['programType'].valueChanges.subscribe(value => {
      console.log(value)
      this._getPlanByType(value._id);
    });
    this._getCurrentPlatform();
    this._getPlanTypes();
    this._getPremiumTypes();
  }

  _getPlanByType(id) {
    this._systemService.on();
    this._planService.find({ query: { 'planType._id': id } }).then((res: any) => {
      this._systemService.off();
      this.plans = res.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getPremiumTypes() {
    this._systemService.on();
    this._premiumTypeService.find({}).then((res: any) => {
      this._systemService.off();
      this.premiumTypes = res.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getHIAs(this.currentPlatform._id);
        this._getProviders(this.currentPlatform._id);
      }
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getHIAs(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType.name': 'Health Insurance Agent', 'platformOwnerId._id': platformOwnerId } }).then((res: any) => {
      this._systemService.off();
      this.hias = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getProviders(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType.name': 'Provider', 'platformOwnerId._id': platformOwnerId } }).then((res: any) => {
      this._systemService.off();
      this.providers = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.find({}).then((res: any) => {
      this._systemService.off();
      this.planTypes = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }
}
