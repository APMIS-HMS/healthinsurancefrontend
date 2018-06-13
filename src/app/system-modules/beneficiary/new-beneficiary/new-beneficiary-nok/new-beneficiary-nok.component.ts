import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Rx';

import {CurrentPlaformShortName} from '../../../../services/globals/config';
import {BankService, CountryService, FacilityService, SystemModuleService, UploadService, UserTypeService} from '../../../../services/index';

import {Address} from './../../../../models/organisation/address';
import {Person} from './../../../../models/person/person';
import {Beneficiary} from './../../../../models/setup/beneficiary';
import {BeneficiaryService} from './../../../../services/beneficiary/beneficiary.service';
import {GenderService} from './../../../../services/common/gender.service';
import {MaritalStatusService} from './../../../../services/common/marital-status.service';
import {RelationshipService} from './../../../../services/common/relationship.service';
import {TitleService} from './../../../../services/common/titles.service';
import {HeaderEventEmitterService} from './../../../../services/event-emitters/header-event-emitter.service';
import {PersonService} from './../../../../services/person/person.service';
import {PolicyService} from './../../../../services/policy/policy.service';


const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX =
    /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
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
  user: any;
  person: any;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
      private _fb: FormBuilder, private _genderService: GenderService,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _userTypeService: UserTypeService,
      private _bankService: BankService,
      private _countriesService: CountryService,
      private _facilityService: FacilityService,
      private _systemService: SystemModuleService,
      private _uploadService: UploadService,
      private _titleService: TitleService, private _router: Router,
      private _maritalService: MaritalStatusService,
      private _relationshipService: RelationshipService,
      private _beneficiaryService: BeneficiaryService,
      private _personService: PersonService, private _locker: CoolLocalStorage,
      private _policyService: PolicyService, private _route: ActivatedRoute) {}

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._addNewDependant();
    this._getCurrentPlatform();
    this._getGenders();
    this._getRelationships();
    this._getTitles();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      }
    });
  }
  _getBeneficiary(id) {
    this._systemService.on();
    this._beneficiaryService.get(id, {})
        .then((payload: any) => {
          this.selectedBeneficiary = payload;
          this._getPerson();
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }

  _getPerson() {
    if (this.user.userType.name === 'Beneficiary') {
      let person$ = Observable.fromPromise(
          this._personService.find({query: {email: this.user.email}}));
      let beneficiary$ = Observable.fromPromise(this._beneficiaryService.find(
          {query: {'personId.email': this.user.email}}));
      Observable.forkJoin([person$, beneficiary$]).subscribe((results: any) => {
        if (results[0].data.length > 0) {
          this.person = results[0].data[0];
        }
        if (results[1].data.length > 0) {
          this._policyService
              .find({query: {principalBeneficiary: results[1].data[0]._id}})
              .then((policies: any) => {
                if (policies.data.length > 0) {
                  policies.data[0].dependantBeneficiaries.forEach(
                      beneficiary => {
                          // this.populateNewDependant(beneficiary.beneficiary,
                          // beneficiary.beneficiary.personId,
                          // beneficiary.relationshipId);
                      })
                }
              })
              .catch(errin => {})
        }
      }, error => {})
    } else {
      let person$ = Observable.fromPromise(this._personService.find(
          {query: {_id: this.selectedBeneficiary.personId._id}}));

      Observable.forkJoin([person$]).subscribe((results: any) => {
        if (results[0].data.length > 0) {
          this.person = results[0].data[0];
        }
        if (this.selectedBeneficiary !== undefined) {
          this._policyService
              .find(
                  {query: {principalBeneficiary: this.selectedBeneficiary._id}})
              .then((policies: any) => {
                if (policies.data.length > 0) {
                  policies.data[0].dependantBeneficiaries.forEach(
                      beneficiary => {
                          // this.populateNewDependant(beneficiary.beneficiary,
                          // beneficiary.beneficiary.personId,
                          // beneficiary.relationshipId);
                      })
                }
              })
              .catch(errin => {})
        }
      }, error => {})
    }
  }

  _addNewDependant() {
    this.today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.frmNok = this._fb.group({
      'dependantArray': this._fb.array([this._fb.group({
        firstName: ['', [<any>Validators.required]],
        title: ['', [<any>Validators.required]],
        middleName: [''],
        lastName: ['', [<any>Validators.required]],
        phonenumber: [
          '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
        ],
        secondaryPhone: ['', [<any>Validators.pattern(PHONE_REGEX)]],
        email: [
          '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
        ],
        dob: [this.today, [<any>Validators.required]],
        gender: ['', [<any>Validators.required]],
        relationship: ['', [<any>Validators.required]],
        lasrraId: ['', []],
        readOnly: [false]
      })])
    });
  }

  _getCurrentPlatform() {
    this._facilityService.find({query: {shortName: CurrentPlaformShortName}})
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
          }
        })
        .catch(err => {});
  }
  _getRelationships() {
    this._systemService.on();
    this._relationshipService.find({})
        .then((payload: any) => {
          this.relationships = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getMaritalStatus() {
    this._systemService.on();
    this._maritalService.find({})
        .then((payload: any) => {
          this.maritalStatuses = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getTitles() {
    this._systemService.on();
    this._titleService.find({})
        .then((payload: any) => {
          this.titles = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getGenders() {
    this._systemService.on();
    this._genderService.find({})
        .then((payload: any) => {
          this.genders = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }

  closeDependant(dependant, i) {
    if ((<FormArray>this.frmNok.controls['dependantArray']).controls.length >
        1) {
      (<FormArray>this.frmNok.controls['dependantArray']).controls.splice(i);
    }
  }

  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid) {
      dependant.value.readOnly = true;
    }
    (<FormArray>this.frmNok.controls['dependantArray']).push(this._fb.group({
      firstName: ['', [<any>Validators.required]],
      title: ['', [<any>Validators.required]],
      middleName: [''],
      lastName: ['', [<any>Validators.required]],
      phonenumber: [
        '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
      ],
      secondaryPhone: ['', <any>Validators.pattern(PHONE_REGEX)],
      email: [
        '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
      ],
      dob: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      relationship: ['', [<any>Validators.required]],
      lasrraId: ['', [<any>Validators.required]],
      readOnly: [false]
    }));
  }
  push(dependant, valid) {
    dependant.controls['readOnly'].setValue(true);
  }

  changeGender($event, gender, dependant) {
    dependant.controls['gender'].setValue(gender);
  }

  moveBack() {
    this._router
        .navigate([
          '/modules/beneficiary/new/dependants', this.selectedBeneficiary._id
        ])
        .then(
            payload => {

            })
        .catch(err => {});
  }
  canProceed() {
    return this.frmNok['controls']
               .dependantArray['controls']
               .filter(x => x.value.readOnly === true && x.valid)
               .length > 0;
  }
  onClickStepTwo(dependants) {
    let savedFiltered = dependants.controls.dependantArray.controls.filter(
        x => x.value.readOnly === true && x.valid);
    let dependantList: any[] = [];
    savedFiltered.forEach(group => {
      let person: any = <any>{};

      person.email = group.controls.email.value;
      person.firstName = group.controls.firstName.value;
      person.gender = group.controls.gender.value;
      person.lastName = group.controls.lastName.value;
      person.otherNames = group.controls.middleName.value;
      person.phoneNumber = group.controls.phonenumber.value;
      person.sphoneNumber = group.controls.secondaryPhone.value;
      person.relationship = group.controls.relationship.value;
      person.title = group.controls.title.value;



      this.person.nextOfKin.push(person);
    });
    this._personService.update(this.person)
        .then(payload => {
          this._router
              .navigate([
                '/modules/beneficiary/new/program', this.selectedBeneficiary._id
              ])
              .then(
                  payload => {

                  })
              .catch(err => {});
        })
        .catch(err => {})

    // this._systemService.announceBeneficiaryTabNotification({ tab: 'Four',
    // beneficiary: this.selectedBeneficiary, dependants: dependantList })
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
}
