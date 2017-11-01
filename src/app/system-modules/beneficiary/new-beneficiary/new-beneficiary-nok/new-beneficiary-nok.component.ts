import { Beneficiary } from './../../../../models/setup/beneficiary';
import { Address } from './../../../../models/organisation/address';
import { Person } from './../../../../models/person/person';
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
  @Input() selectedBeneficiary: any;
  frmNok: FormGroup;
  lgs: any[] = [];
  residenceLgs: any[] = [];
  cities: any[] = [];
  genders: any[] = [];
  titles: any[] = [];
  maritalStatuses: any[] = [];
  relationships: any[] = [];

  currentPlatform: any;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

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
    private _route: ActivatedRoute
  ) {
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      console.log(value)
      if (value.beneficiary !== undefined) {
        console.log(value);
      }
    });
  }

  ngOnInit() {
    this._addNewDependant();
    this._getCurrentPlatform();
    this._getGenders();
    this._getRelationships();
    this._getTitles();
  }

  _addNewDependant() {
    this.today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
    this.frmNok = this._fb.group({
      'dependantArray': this._fb.array([
        this._fb.group({
          firstName: ['', [<any>Validators.required]],
          title: ['', [<any>Validators.required]],
          middleName: [''],
          lastName: ['', [<any>Validators.required]],
          phonenumber: ['', [<any>Validators.required]],
          secondaryPhone: [''],
          email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
          dob: [this.today, [<any>Validators.required]],
          gender: ['', [<any>Validators.required]],
          relationship: ['', [<any>Validators.required]],
          lasrraId: ['', []],
          readOnly: [false]
        })
      ])
    });
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }).catch(err => {
      console.log(err);
    });
  }
  _getRelationships() {
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

  closeDependant(dependant, i) {
    console.log(dependant)
  }

  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid) {
      dependant.value.readOnly = true;
    }
    (<FormArray>this.frmNok.controls['dependantArray'])
      .push(
      this._fb.group({
        firstName: ['', [<any>Validators.required]],
        title: ['', [<any>Validators.required]],
        middleName: [''],
        lastName: ['', [<any>Validators.required]],
        phonenumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
        secondaryPhone: [''],
        email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
        dob: ['', [<any>Validators.required]],
        gender: ['', [<any>Validators.required]],
        relationship: ['', [<any>Validators.required]],
        lasrraId: ['', [<any>Validators.required]],
        readOnly: [false]
      })
      );
  }
  push(dependant, valid) {
    dependant.controls['readOnly'].setValue(true);
  }

  changeGender($event, gender, dependant) {
    dependant.controls['gender'].setValue(gender);
  }

  moveBack(){
    this._systemService.announceBeneficiaryTabNotification({tab:'Two',beneficiary:this.selectedBeneficiary});
  }

  onClickStepTwo(dependants) {
    console.log(dependants)
    let savedFiltered = dependants.controls.dependantArray.controls.filter(x => x.value.readOnly === true && x.valid);
    let dependantList: any[] = [];
    savedFiltered.forEach(group => {
      let person: Person = <Person>{};

      person.dateOfBirth = group.controls.dob.value.jsdate;
      person.email = group.controls.email.value;
      person.firstName = group.controls.firstName.value;
      person.gender = group.controls.gender.value;
      person.homeAddress = this.selectedBeneficiary.personId.homeAddress;
      person.lastName = group.controls.lastName.value;
      person.otherNames = group.controls.middleName.value;
      person.phoneNumber = group.controls.phonenumber.value;
      person.platformOnwerId = this.currentPlatform._id;
      person.title = group.controls.title.value;
    

      let beneficiary: Beneficiary = <Beneficiary>{};
      beneficiary.stateID = group.lasrraId;
      beneficiary.platformOwnerId = this.selectedBeneficiary.platformOwnerId;


      dependantList.push({person:person, beneficiary:beneficiary, relationship:group.controls.relationship.value});

      // console.log(group)
    });
    // console.log(dependantList);

    this._systemService.announceBeneficiaryTabNotification({tab:'Four',beneficiary:this.selectedBeneficiary, dependants:dependantList})
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }

}
