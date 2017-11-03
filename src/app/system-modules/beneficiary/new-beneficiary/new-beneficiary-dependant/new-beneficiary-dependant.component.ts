import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { FORM_VALIDATION_ERROR_MESSAGE, MAXIMUM_NUMBER_OF_DEPENDANTS } from './../../../../services/globals/config';
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
  selector: 'app-new-beneficiary-dependant',
  templateUrl: './new-beneficiary-dependant.component.html',
  styleUrls: ['./new-beneficiary-dependant.component.scss']
})
export class NewBeneficiaryDependantComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      console.log(value)
      if (value.beneficiary !== undefined) {
        console.log(value);
      }
    });
  }
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
    private _route: ActivatedRoute,
    private _beneficiaryService: BeneficiaryService
  ) {

  }

  ngOnInit() {
    this._addNewDependant();
    this._getCurrentPlatform();
    this._getGenders();
    this._getRelationships();
    this._getTitles();
    console.log(this.selectedBeneficiary)
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      console.log(value)
      if (value.beneficiary !== undefined) {
        console.log(value);
      }
    });
  }

  _addNewDependant() {
    this.today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
    this.frmDependants = this._fb.group({
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
    this._facilityService.find({
      query:
      { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] }
    }).then((res: any) => {
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
    if ((<FormArray>this.frmDependants.controls['dependantArray']).controls.length > 1) {
      (<FormArray>this.frmDependants.controls['dependantArray']).controls.splice(i);
    }
  }

  pushNewDependant(dependant?, index?) {
    // console.log((<FormArray>this.frmDependants.controls['dependantArray']).controls.length)
    // console.log(dependant)
    console.log(this.selectedBeneficiary.numberOfUnderAge)
    if (dependant !== undefined && dependant.valid && (<FormArray>this.frmDependants.controls['dependantArray']).controls.length < (this.selectedBeneficiary.numberOfUnderAge)) {
      dependant.value.readOnly = true;

      (<FormArray>this.frmDependants.controls['dependantArray'])
        .push(
        this._fb.group({
          firstName: ['', [<any>Validators.required]],
          title: ['', [<any>Validators.required]],
          middleName: [''],
          lastName: ['', [<any>Validators.required]],
          phonenumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
          secondaryPhone: [''],
          email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
          dob: [this.today, [<any>Validators.required]],
          gender: ['', [<any>Validators.required]],
          relationship: ['', [<any>Validators.required]],
          lasrraId: ['', []],
          readOnly: [false]
        })
        );
    } else {
      this._toastr.warning("A Household cannot have more than 5 (Five) dependants!!!", "Warning")
    }
  }
  push(dependant, valid) {
    this._beneficiaryService.validateAge(dependant.value.dob).then(res => {
      console.log(res)
      if (res.body.response >= 18 && !this.hasDependantAbove18) {
        this.hasDependantAbove18 = true;
        if (valid) {
          console.log(dependant.value)
          dependant.controls['readOnly'].setValue(true);
        } else {
          let counter = 0;
          this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
          Object.keys(dependant.controls).forEach((field, i) => { // {1}
            const control = dependant.get(field);
            if (!control.valid) {
              control.markAsDirty({ onlySelf: true });
              counter = counter + 1;
            }
          });
        }
      } else if (res.body.response < 18) {
        if (valid) {
          console.log(dependant.value)
          dependant.controls['readOnly'].setValue(true);
        } else {
          let counter = 0;
          this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
          Object.keys(dependant.controls).forEach((field, i) => { // {1}
            const control = dependant.get(field);
            if (!control.valid) {
              control.markAsDirty({ onlySelf: true });
              counter = counter + 1;
            }
          });
        }
      }
      else {
        this._toastr.warning('A principal can only have one dependant that is above 18 years of age', 'Warning');
        return;
      }
      // return res.body.response >= 18 ? null : { underage: true };
    });


  }

  changeGender($event, gender, dependant) {
    dependant.controls['gender'].setValue(gender);
  }

  moveBack() {
    this._systemService.announceBeneficiaryTabNotification({ tab: 'One', beneficiary: this.selectedBeneficiary });
  }

  skip() {
    this._systemService.announceBeneficiaryTabNotification({ tab: 'Three', beneficiary: this.selectedBeneficiary })
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


      dependantList.push({ person: person, beneficiary: beneficiary, relationship: group.controls.relationship.value });

      // console.log(group)
    });
    //console.log(this.selectedBeneficiary);

    this._systemService.announceBeneficiaryTabNotification({ tab: 'Four', beneficiary: this.selectedBeneficiary, dependants: dependantList })
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }

}
