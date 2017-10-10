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
  selector: 'app-new-beneficiary-nok',
  templateUrl: './new-beneficiary-nok.component.html',
  styleUrls: ['./new-beneficiary-nok.component.scss']
})
export class NewBeneficiaryNokComponent implements OnInit {

  frmNok: FormGroup;
  genders: any[] = [];
  titles: any[] = [];
  maritalStatuses: any[] = [];
  relationships:any[] = [];

  currentPlatform:any;
  
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
      private _relationshipService:RelationshipService,
      private _route: ActivatedRoute
    ) { }
  
    ngOnInit() {
      this.frmNok = this._fb.group({
        firstName: ['', [<any>Validators.required]],
        middleName: [''],
        title: ['', [<any>Validators.required]],
        lastName: ['', [<any>Validators.required]],
        phonenumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
        secondaryPhone: ['', <any>Validators.pattern(PHONE_REGEX)],
        relationship: ['', [<any>Validators.required]],
        email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
        gender: ['', [<any>Validators.required]],
      });

      this._getCurrentPlatform();
      this._getGenders();
      this._getTitles();
      this._getRelationships();
    }

    _getCurrentPlatform() {
      this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
        console.log(res);
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
        }
      }).catch(err => {
        console.log(err);
      });
    }
    _getRelationships(){
      this._systemService.on();
      this._relationshipService.find({}).then((payload: any) => {
        this.relationships = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    }
    _getMaritalStatus() {
      this._systemService.on();
      this._maritalService.find({}).then((payload: any) => {
        this.maritalStatuses = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    }
    _getTitles() {
      this._systemService.on();
      this._titleService.find({}).then((payload: any) => {
        this.titles = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    }
    _getGenders() {
      this._systemService.on();
      this._genderService.find({}).then((payload: any) => {
        this.genders = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    }
  
  }
  