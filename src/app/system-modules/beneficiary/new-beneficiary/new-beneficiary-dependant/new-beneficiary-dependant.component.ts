import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Rx';

import {environment} from '../../../../../environments/environment';
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
import {FORM_VALIDATION_ERROR_MESSAGE, MAXIMUM_NUMBER_OF_DEPENDANTS} from './../../../../services/globals/config';
import {PersonService} from './../../../../services/person/person.service';
import {PolicyService} from './../../../../services/policy/policy.service';


const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX =
    /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-beneficiary-dependant',
  templateUrl: './new-beneficiary-dependant.component.html',
  styleUrls: ['./new-beneficiary-dependant.component.scss']
})
export class NewBeneficiaryDependantComponent implements OnInit {
  @Input() selectedBeneficiary: any;
  frmDependants: FormGroup;
  lgs: any[] = [];
  residenceLgs: any[] = [];
  cities: any[] = [];
  genders: any[] = [];
  titles: any[] = [];
  maritalStatuses: any[] = [];
  relationships: any[] = [];

  currentPlatform: any;
  hasDependantAbove18 = false;
  isEventBased = false;
  user: any;
  person: any;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;
  platformName: string;

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
      private _route: ActivatedRoute, private _locker: CoolLocalStorage,
      private _personService: PersonService,
      private _policyService: PolicyService,
      private _beneficiaryService: BeneficiaryService) {
    this.platformName = environment.platform;
  }

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
    })
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
                        this.populateNewDependant(
                            beneficiary.beneficiary,
                            beneficiary.beneficiary.personId,
                            beneficiary.relationshipId);
                      })
                } else {
                  this.selectedBeneficiary = results[1].data[0];
                  if (!this.isEventBased) {
                    this._router
                        .navigate([
                          '/modules/beneficiary/new/principal',
                          this.selectedBeneficiary._id
                        ])
                        .then(
                            payload => {

                            })
                        .catch(err => {});
                  }
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
                        this.populateNewDependant(
                            beneficiary.beneficiary,
                            beneficiary.beneficiary.personId,
                            beneficiary.relationshipId);
                      })
                } else {
                  // if (!this.isEventBased) {
                  //   this._router.navigate(['/modules/beneficiary/new/principal',
                  //   this.selectedBeneficiary._id]).then(payload => {

                  //   }).catch(err => {
                  //     console.log(err)
                  //   });
                  // }
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
    this.frmDependants = this._fb.group({
      'dependantArray': this._fb.array([this._fb.group({
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
        dob: [this.today, [<any>Validators.required]],
        gender: ['', [<any>Validators.required]],
        relationship: ['', [<any>Validators.required]],
        lasrraId: ['', []],
        readOnly: [false]
      })])
    });
  }
  _getCurrentPlatform() {
    this._facilityService
        .find({
          query: {
            shortName: this.platformName,
            $select: ['name', 'shortName', 'address.state']
          }
        })
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
    if ((<FormArray>this.frmDependants.controls['dependantArray'])
            .controls.length > 1) {
      (<FormArray>this.frmDependants.controls['dependantArray'])
          .controls.splice(i);
    }
  }

  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid &&
        (<FormArray>this.frmDependants.controls['dependantArray'])
                .controls.length <
            (this.selectedBeneficiary.numberOfUnderAge)) {
      dependant.value.readOnly = true;
      (<FormArray>this.frmDependants.controls['dependantArray'])
          .push(this._fb.group({
            firstName: ['', [<any>Validators.required]],
            title: ['', [<any>Validators.required]],
            middleName: [''],
            lastName: ['', [<any>Validators.required]],
            phonenumber: [
              '',
              [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
            ],
            secondaryPhone: [''],
            email: [
              '',
              [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
            ],
            dob: [this.today, [<any>Validators.required]],
            gender: ['', [<any>Validators.required]],
            relationship: ['', [<any>Validators.required]],
            lasrraId: ['', []],
            readOnly: [false]
          }));
    } else {
      this._toastr.warning(
          'A Household cannot have more than 5 (Five) dependants!!!', 'Warning')
    }
  }
  populateNewDependant(dependant, person, relationshipId) {
    this.frmDependants.controls['dependantArray'] = new FormArray([]);


    (<FormArray>this.frmDependants.controls['dependantArray'])
        .push(this._fb.group({
          firstName: [
            person !== undefined ? person.firstName : '',
            [<any>Validators.required]
          ],
          title: [
            person !== undefined ? person.title : '', [<any>Validators.required]
          ],
          middleName: [person !== undefined ? person.otherNames : ''],
          lastName: [
            person !== undefined ? person.lastName : '',
            [<any>Validators.required]
          ],
          phonenumber: [
            person !== undefined ? person.phoneNumber : 0,
            [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
          ],
          secondaryPhone: ['', <any>Validators.pattern(PHONE_REGEX)],
          email: [
            person !== undefined ? person.email : '',
            [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
          ],
          dob: [
            person !== undefined ? person.dateOfBirth : this.today,
            [<any>Validators.required]
          ],
          gender: [
            person !== undefined ? person.gender : '',
            [<any>Validators.required]
          ],
          relationship: [
            relationshipId !== undefined ? relationshipId : '',
            [<any>Validators.required]
          ],
          lasrraId: [dependant !== undefined ? dependant.stateID : '', []],
          readOnly: [false],
          id: []
        }));
  }
  push(dependant, valid) {
    this._beneficiaryService.validateAge(dependant.value.dob).then(res => {
      if (res.body.response >= 18 && !this.hasDependantAbove18) {
        this.hasDependantAbove18 = true;
        if (valid) {
          dependant.controls['readOnly'].setValue(true);
        } else {
          let counter = 0;
          this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
          Object.keys(dependant.controls).forEach((field, i) => {  // {1}
            const control = dependant.get(field);
            if (!control.valid) {
              control.markAsDirty({onlySelf: true});
              counter = counter + 1;
            }
          });
        }
      } else if (res.body.response < 18) {
        if (valid) {
          dependant.controls['readOnly'].setValue(true);
        } else {
          let counter = 0;
          this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
          Object.keys(dependant.controls).forEach((field, i) => {  // {1}
            const control = dependant.get(field);
            if (!control.valid) {
              control.markAsDirty({onlySelf: true});
              counter = counter + 1;
            }
          });
        }
      } else {
        this._toastr.warning(
            'A principal can only have one dependant that is above 18 years of age',
            'Warning');
        return;
      }
      // return res.body.response >= 18 ? null : { underage: true };
    });
  }

  changeGender($event, gender, dependant) {
    dependant.controls['gender'].setValue(gender);
  }

  moveBack() {
    // this._systemService.announceBeneficiaryTabNotification({ tab: 'One',
    // beneficiary: this.selectedBeneficiary });
    this._router
        .navigate([
          '/modules/beneficiary/new/principal', this.selectedBeneficiary._id
        ])
        .then(
            payload => {

            })
        .catch(err => {});
  }

  skip() {
    // this._systemService.announceBeneficiaryTabNotification({ tab: 'Three',
    // beneficiary: this.selectedBeneficiary })
    this._router
        .navigate([
          '/modules/beneficiary/new/next-of-kin', this.selectedBeneficiary._id
        ])
        .then(
            payload => {

            })
        .catch(err => {});
  }

  onClickStepTwo(dependants) {
    let savedFiltered = dependants.controls.dependantArray.controls.filter(
        x => x.value.readOnly === true && x.valid);
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


      dependantList.push({
        person: person,
        beneficiary: beneficiary,
        relationship: group.controls.relationship.value
      });

      // console.log(group)
    });
    // console.log(this.selectedBeneficiary);

    // this._systemService.announceBeneficiaryTabNotification({ tab: 'Four',
    // beneficiary: this.selectedBeneficiary, dependants: dependantList })
    this._router
        .navigate(
            ['/modules/beneficiary/new/program', this.selectedBeneficiary._id])
        .then(payload => {
          this._systemService.announceBeneficiaryTabNotification({
            tab: 'Four',
            beneficiary: this.selectedBeneficiary,
            dependants: dependantList
          });
        })
        .catch(err => {});
  }
  canProceed() {
    return this.frmDependants['controls']
               .dependantArray['controls']
               .filter(x => x.value.readOnly === true && x.valid)
               .length > 0;
  }
  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
}
