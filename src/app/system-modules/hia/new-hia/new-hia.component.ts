import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, CountryService, BankService, ContactPositionService, UserTypeService,
  FacilityService
} from './../../../services/index';
import { HIA } from './../../../models/organisation/hia';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary, Hia, Contact, BankDetail } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

// import { Contact, BankDetail } from '../../../models/index';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-hia',
  templateUrl: './new-hia.component.html',
  styleUrls: ['./new-hia.component.scss']
})
export class NewHiaComponent implements OnInit {
  hiaFormGroup: FormGroup;
  hiaTypes: any = [];
  hiaPlans: any = [];
  contactPositions: any = [];
  plans: any = [];
  userTypes: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  saveBtn: string = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  selectedUserType: any;
  selectedCountry: any;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService,
    private _contactPositionService: ContactPositionService,
    private _facilityService: FacilityService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _systemService: SystemModuleService
  ) { }
  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New HIA');
    this._headerEventEmitter.setMinorRouteUrl('Create new Health Insurance Agent');

    this.hiaFormGroup = this._fb.group({
      agentName: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      address: ['', [<any>Validators.required]],
      state: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      city: ['', [<any>Validators.required]],
      neighbourhood: ['', [<any>Validators.required]],
      phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      businessContactName: ['', [<any>Validators.required]],
      businessContactFirstName: ['', [<any>Validators.required]],
      businessContactNumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      businessContactPosition: ['', [<any>Validators.required]],
      businessContactEmail: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      iTContactName: ['', [<any>Validators.required]],
      iTContactFirstName: ['', [<any>Validators.required]],
      iTContactNumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      iTContactPosition: ['', [<any>Validators.required]],
      iTContactEmail: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      type: ['', [<any>Validators.required]],
      bank: ['', [<any>Validators.required]],
      bankAccName: ['', [<any>Validators.required]],
      bankAccNumber: ['', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
      nhisNumber: ['', [<any>Validators.required]],
      cinNumber: ['', [<any>Validators.required]],
      registrationDate: ['', [<any>Validators.required]]
    });

    this._getContactPositions();
    this._getUserTypes();
    this._getBanks();
    this._getCountries();

    this.hiaFormGroup.controls['state'].valueChanges.subscribe(value => {
      if (value !== null) {
        this._getLgaAndCities(this.selectedCountry._id, value);
      }
    })
  }

  _getCountries() {
    this._systemService.on();
    this._countriesService.find({
      query: {
        $limit: 200,
        $select: { 'states': 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.countries = payload.data;
      const index = this.countries.findIndex(x => x.name === 'Nigeria');
      if (index > -1) {
        this.selectedCountry = this.countries[index];
        this._getStates(this.selectedCountry._id);
      }
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getStates(_id) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
        $limit: 200,
        $select: { 'states.cities': 0, 'states.lgs': 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.states = payload.data[0].states;
      }

    }).catch(error => {
      this._systemService.off();
    })
  }

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
        'states.name': state.name,
        $select: { 'states.$': 1 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        const states = payload.data[0].states;
        if (states.length > 0) {
          this.cities = states[0].cities;
          this.lgs = states[0].lgs;
        }
      }

    }).catch(error => {
      this._systemService.off();
    })
  }
  _getBanks() {
    this._systemService.on();
    this._bankService.find({
      query: {
        $limit: 200
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.banks = payload.data;
    }).catch(err => {
      this._systemService.off();
    })
  }

  _extractBusinessContact(businessContact?: Contact) {
    if (businessContact === undefined) {
      businessContact = <Contact>{};
    }
    businessContact.lastName = this.hiaFormGroup.controls['businessContactName'].value;
    businessContact.firstName = this.hiaFormGroup.controls['businessContactFirstName'].value;
    businessContact.email = this.hiaFormGroup.controls['businessContactEmail'].value;
    businessContact.phoneNumber = this.hiaFormGroup.controls['businessContactNumber'].value;
    businessContact.position = this.hiaFormGroup.controls['businessContactPosition'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.hiaFormGroup.controls['iTContactName'].value;
    itContact.firstName = this.hiaFormGroup.controls['iTContactFirstName'].value;
    itContact.email = this.hiaFormGroup.controls['iTContactName'].value;
    itContact.phoneNumber = this.hiaFormGroup.controls['iTContactNumber'].value;
    itContact.position = this.hiaFormGroup.controls['iTContactPosition'].value;
    return itContact;
  }
  _extractBankDetail(bankDetail?: BankDetail) {
    if (bankDetail === undefined) {
      bankDetail = <BankDetail>{};
    }
    bankDetail.accountNumber = this.hiaFormGroup.controls['bankAccNumber'].value;
    bankDetail.bank = this.hiaFormGroup.controls['bank'].value;
    bankDetail.name = this.hiaFormGroup.controls['bankAccName'].value;
    return bankDetail;
  }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.hiaFormGroup.controls['city'].value;
    address.lga = this.hiaFormGroup.controls['lga'].value;
    address.neighbourhood = this.hiaFormGroup.controls['neighbourhood'].value;
    address.state = this.hiaFormGroup.controls['state'].value;
    address.street = this.hiaFormGroup.controls['address'].value;
    return address;
  }
  _extractHIA(hia?: HIA) {
    if (hia === undefined) {
      hia = <HIA>{};
    }
    hia.nhisNumber = this.hiaFormGroup.controls['nhisNumber'].value;
    hia.cin = this.hiaFormGroup.controls['cinNumber'].value;
    hia.registrationDate = this.hiaFormGroup.controls['registrationDate'].value;
    return hia;
  }

  _extractFacility(facility?: Facility) {
    const businessContact = this._extractBusinessContact();
    const itContact = this._extractITContact();
    const bankDetails = this._extractBankDetail();
    const address = this._extractAddress();
    const hia = this._extractHIA();

    if (facility === undefined) {
      facility = <Facility>{};
    }
    facility.address = address;
    facility.bankDetails = bankDetails;
    facility.businessContact = businessContact;
    facility.itContact = itContact;
    facility.hia = hia;
    facility.email = this.hiaFormGroup.controls['email'].value;
    facility.name = this.hiaFormGroup.controls['agentName'].value;
    facility.phoneNumber = this.hiaFormGroup.controls['phone'].value;
    facility.facilityType = this.selectedUserType;

    return facility;
  }

  onClickSaveHia(value: any, valid: boolean) {
    if (valid) {
      this._systemService.on();
      this.saveBtn = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
      let facility = this._extractFacility();

      this._facilityService.create(facility).then(payload => {
        this._systemService.off();
        this.hiaFormGroup.reset();
        this.saveBtn = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
        this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
      }).catch(err => {
        this._systemService.off();
      });

    } else {
      this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
    }
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
        const index = payload.data.findIndex(x => x.name === 'Health Insurance Agent');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this.hiaFormGroup.controls['type'].setValue(this.selectedUserType);
        } else {
          this.selectedUserType = undefined;
          this.hiaFormGroup.controls['type'].reset();
        }
      }
    }, error => {
      this._systemService.off();
    })
  }

  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({}).then((payload: any) => {
      this._systemService.off();
      this.contactPositions = payload.data;
    }).catch(err => {
      this._systemService.off();
    })
  }
  onClickSaveEmployer(value, valid) {

  }
  compareState(s1: any, s2: any) {
    return s1._id === s2._id;
  }
}
