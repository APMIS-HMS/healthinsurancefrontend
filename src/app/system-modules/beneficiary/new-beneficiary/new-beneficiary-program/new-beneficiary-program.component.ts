import { FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
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
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, SPONSORSHIP } from '../../../../services/globals/config';
import {
  UserTypeService, BankService, CountryService, FacilityService, SystemModuleService, UploadService
} from '../../../../services/index';


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

  @Input() selectedBeneficiary: any;
  @Input() dependants: any[];
  frmProgram: FormGroup;
  currentPlatform: any;
  hias: any[] = [];
  providers: any[] = [];
  planTypes: any[] = [];
  plans: any[] = [];
  premiumTypes: any[] = [];
  premiumPackages: any[] = [];
  filteredPremiumPackages: any[] = [];
  sponsorships: any[] = SPONSORSHIP;

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
    private _planService: PlanService,
    private _premiumTypeService: PremiumTypeService,
    private _beneficiaryService: BeneficiaryService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.frmProgram = this._fb.group({
      hiaName: [''],
      programType: ['', [<any>Validators.required]],
      premiumCategory: ['', [<any>Validators.required]],
      programName: ['', [<any>Validators.required]],
      providerName: ['', [<any>Validators.required]],
      premiumPackage: ['', [<any>Validators.required]],
      sponsorship: ['', [<any>Validators.required]]
    });

    this.frmProgram.controls['programType'].valueChanges.subscribe(value => {
      console.log(value);
      this._getPlanByType(value._id);
    });

    this.frmProgram.controls['programName'].valueChanges.subscribe(value => {
      console.log(value);
      this.premiumPackages = value.premiums;
      this.filteredPremiumPackages = value.premiums;
    });

    this.frmProgram.controls['premiumCategory'].valueChanges.subscribe(value => {
      if (this.filteredPremiumPackages.length > 0) {
        this.premiumPackages = this.filteredPremiumPackages.filter(e => e.category.name.toLowerCase() === value.name.toLowerCase());
      }
    });
    this._getCurrentPlatform();
    this._getPlanTypes();
    this._getPremiumTypes();
    console.log(this.dependants);
  }

  _getPlanByType(id) {
    this._systemService.on();
    this._planService.find({ query: { 'planType._id': id } }).then((res: any) => {
      this._systemService.off();
      console.log(res.data);
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
    this._facilityService.find({ query:   { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] } }).then((res: any) => {
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
    this._facilityService.find({
      query: { 'facilityType.name': 'Health Insurance Agent', 'platformOwnerId._id': platformOwnerId,
      $select: ['name','hia']
     }
    }).then((res: any) => {
      this._systemService.off();
      this.hias = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getProviders(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({
      query: { 'facilityType.name': 'Provider', 'platformOwnerId._id': platformOwnerId,
      $select: ['name','provider.providerId']
     }
    }).then((res: any) => {
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

  onClickStepFour(value, valid) {
    console.log(value);
    if (valid) {
      let policy: any = <any>{};
      policy.platformOwnerId = this.selectedBeneficiary.platformOwnerId;
      policy.principalBeneficiary = this.selectedBeneficiary._id;
      policy.hiaId = value.hiaName;
      policy.providerId = value.providerName;
      policy.planTypeId = value.programType;
      policy.planId = value.programName._id;
      policy.premiumCategoryId = value.premiumCategory;
      policy.premiumPackageId = value.premiumPackage;
      policy.sponsorshipId = value.sponsorship;

      let body = {
        principal: this.selectedBeneficiary,
        persons: this.dependants,
        policy: policy,
        platform: this.selectedBeneficiary.platformOwnerId
      };
      console.log(body);

      this._beneficiaryService.updateWithMiddleWare(body).then(payload => {
        console.log(payload);
        this._systemService.announceBeneficiaryTabNotification({
          tab: 'Five',
          policy: payload.body.policyObject
        });
      }).catch(err => {
        console.log(err);
      });
    } else {
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.frmProgram.controls).forEach((field, i) => { // {1}
        const control = this.frmProgram.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
          counter = counter + 1;
        }
      });
    }

  }
}
