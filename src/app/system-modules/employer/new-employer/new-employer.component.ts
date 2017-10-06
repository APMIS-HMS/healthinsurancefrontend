import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
  UserTypeService, SystemModuleService,
} from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.scss']
})
export class NewEmployerComponent implements OnInit {
  employerFormGroup: FormGroup;
  countryId: string = "";
  stateId: string = "";
  industries: any = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  userTypes: any[] = [];
  contactPositions: any[] = [];
  saveBtn: string = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  selectedUserType: any;
  selectedCountry: any;
  selectedState: any
  facility: any;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _industryService: IndustryService,
    private _userTypeService: UserTypeService,
    private _contactPositionService: ContactPositionService,
    private _facilityService: FacilityService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _route: ActivatedRoute,
    private _systemService: SystemModuleService
  ) { }
  ngAfterViewInit() {
    this._route.params.subscribe(param => {

      if (param.id !== undefined) {
        console.log(param)
        this._getEmployerDetails(param.id);
      } else {
        this._initialiseFormGroup();
      }
    })
  }
  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Employer');
    this._headerEventEmitter.setMinorRouteUrl('');
    this._initialiseFormGroup();
    this._getIndustries();

    this._getContactPositions();
    this._getCountries();
    this._getBanks();
    this._getUserTypes();
    // this.employerFormGroup = this._fb.group({
    // 	employerName: [this.facility != null ? this.facility.name : '', [<any>Validators.required]],
    // 	address: ['', [<any>Validators.required]],
    // 	email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
    // 	state: [this.facility != null ? this.facility.address.state : '', [<any>Validators.required]],
    // 	city: ['', [<any>Validators.required]],
    // 	lga: ['', [<any>Validators.required]],
    // 	neighbourhood: ['', [<any>Validators.required]],
    // 	phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    // 	bc_lname: ['', [<any>Validators.required]],
    // 	bc_fname: ['', [<any>Validators.required]],
    // 	bc_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    // 	bc_position: ['', [<any>Validators.required]],
    // 	bc_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
    // 	it_lname: ['', [<any>Validators.required]],
    // 	it_fname: ['', [<any>Validators.required]],
    // 	it_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    // 	it_position: ['', [<any>Validators.required]],
    // 	it_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
    // 	type: ['', [<any>Validators.required]],
    // 	bank: ['', [<any>Validators.required]],
    // 	bankAccName: ['', [<any>Validators.required]],
    // 	bankAccNumber: ['', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
    // 	cacNumber: ['', [<any>Validators.required]],
    // 	cinNumber: ['', [<any>Validators.required]]
    // });

    // this.employerFormGroup.controls['state'].valueChanges.subscribe(value => {
    // 	console.log(value)
    // 	if (value !== null) {
    // 		this._getLgaAndCities(this.selectedCountry._id, value);
    // 	}
    // });


  }
  _initialiseFormGroup() {
    this.employerFormGroup = this._fb.group({
      employerName: [this.facility != null ? this.facility.name : '', [<any>Validators.required]],
      address: [this.facility != null ? this.facility.address.street : '', [<any>Validators.required]],
      email: [this.facility != null ? this.facility.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      state: [this.facility != null ? this.facility.address.state : '', [<any>Validators.required]],
      city: [this.facility != null ? this.facility.address.city : '', [<any>Validators.required]],
      lga: [this.facility != null ? this.facility.address.lga : '', [<any>Validators.required]],
      neighbourhood: [this.facility != null ? this.facility.address.neighbourhood : '', [<any>Validators.required]],
      phone: [this.facility != null ? this.facility.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_lname: [this.facility != null ? this.facility.businessContact.lastName : '', [<any>Validators.required]],
      bc_fname: [this.facility != null ? this.facility.businessContact.firstName : '', [<any>Validators.required]],
      bc_phone: [this.facility != null ? this.facility.businessContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_position: [this.facility != null ? this.facility.businessContact.position : '', [<any>Validators.required]],
      bc_email: [this.facility != null ? this.facility.businessContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      it_lname: [this.facility != null ? this.facility.itContact.lastName : '', [<any>Validators.required]],
      it_fname: [this.facility != null ? this.facility.itContact.firstName : '', [<any>Validators.required]],
      it_phone: [this.facility != null ? this.facility.itContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      it_position: [this.facility != null ? this.facility.itContact.position : '', [<any>Validators.required]],
      it_email: [this.facility != null ? this.facility.itContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      type: [this.facility != null ? this.facility.employer.industry : '', [<any>Validators.required]],
      bank: [this.facility != null ? this.facility.bankDetails.bank : '', [<any>Validators.required]],
      bankAccName: [this.facility != null ? this.facility.bankDetails.name : '', [<any>Validators.required]],
      bankAccNumber: [this.facility != null ? this.facility.bankDetails.accountNumber : '', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
      cacNumber: [this.facility != null ? this.facility.employer.cacNumber : '', [<any>Validators.required]],
      cinNumber: [this.facility != null ? this.facility.employer.cin : '', [<any>Validators.required]]
    });
    console.log(this.industries);
    this.employerFormGroup.controls['state'].valueChanges.subscribe(value => {
      console.log(this.selectedCountry);
      this.selectedState = value;
      if (value !== null && this.selectedCountry !== undefined) {
        this._getLgaAndCities(this.selectedCountry._id, value);
      }
    });
    if (this.facility !== undefined) {
      this.selectedState = this.facility.address.state;
      this.employerFormGroup.controls['type'].setValue(this.facility.employer.industry);
    }
  }

  _getEmployerDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {})
      .then((res: Facility) => {
        this._systemService.off();
        this.facility = res;
        this._initialiseFormGroup();
      }).catch(err => {
        this._systemService.off();
      })

  }
  compareState(s1: any, s2: any) {
    return s1._id === s2._id;
  }
  compareCity(c1: any, c2: any) {
    return c1._id === c2._id;
  }
  compareLGA(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareIndustry(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compare(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({}).then((payload: any) => {
      this._systemService.off();
      this.contactPositions = payload.data;
      if (this.facility !== undefined) {
        this.employerFormGroup.controls['bc_position'].setValue(this.facility.businessContact.position);
        this.employerFormGroup.controls['it_position'].setValue(this.facility.itContact.position);
      }
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
        const index = payload.data.findIndex(x => x.name === 'Employer');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this.employerFormGroup.controls['type'].setValue(this.selectedUserType);
        } else {
          this.selectedUserType = undefined;
          this.employerFormGroup.controls['type'].reset();
        }
      }
    }, error => {
      this._systemService.off();
    })
  }
  _getCountries() {
    this._systemService.on();
    this._countriesService.find({
      query: {
        $limit: 200,
        $select: { "states": 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.countries = payload.data;
      const index = this.countries.findIndex(x => x.name === 'Nigeria');
      if (index > -1) {
        this.selectedCountry = this.countries[index];
        this._getStates(this.selectedCountry._id);
        if (this.selectedState !== undefined) {
          this._getLgaAndCities(this.selectedCountry._id, this.selectedState);
        }
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
        $select: { "states.cities": 0, "states.lgs": 0 }
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
        "states.name": state.name,
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
    businessContact.lastName = this.employerFormGroup.controls['bc_fname'].value;
    businessContact.firstName = this.employerFormGroup.controls['bc_lname'].value;
    businessContact.email = this.employerFormGroup.controls['bc_email'].value;
    businessContact.phoneNumber = this.employerFormGroup.controls['bc_phone'].value;
    businessContact.position = this.employerFormGroup.controls['bc_position'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.employerFormGroup.controls['it_fname'].value;
    itContact.firstName = this.employerFormGroup.controls['it_lname'].value;
    itContact.email = this.employerFormGroup.controls['it_email'].value;
    itContact.phoneNumber = this.employerFormGroup.controls['it_phone'].value;
    itContact.position = this.employerFormGroup.controls['it_position'].value;
    return itContact;
  }
  _extractBankDetail(bankDetail?: BankDetail) {
    if (bankDetail === undefined) {
      bankDetail = <BankDetail>{};
    }
    bankDetail.accountNumber = this.employerFormGroup.controls['bankAccNumber'].value;
    bankDetail.bank = this.employerFormGroup.controls['bank'].value;
    bankDetail.name = this.employerFormGroup.controls['bankAccName'].value;
    return bankDetail;
  }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.employerFormGroup.controls['city'].value;
    address.lga = this.employerFormGroup.controls['lga'].value;
    address.neighbourhood = this.employerFormGroup.controls['neighbourhood'].value;
    address.state = this.employerFormGroup.controls['state'].value;
    address.street = this.employerFormGroup.controls['address'].value;
    return address;
  }
  _extractEmployer(employer?: Employer) {
    if (employer === undefined) {
      employer = <Employer>{};
    }

    employer.industry = this.employerFormGroup.controls['type'].value;
    employer.cin = this.employerFormGroup.controls['cinNumber'].value;
    employer.cacNumber = this.employerFormGroup.controls['cacNumber'].value;
    return employer;
  }

  _extractFacility(facility?: Facility) {
    const businessContact = this._extractBusinessContact();
    const itContact = this._extractITContact();
    const bankDetails = this._extractBankDetail();
    const address = this._extractAddress();
    const employer = this._extractEmployer();

    if (facility === undefined) {
      facility = <Facility>{};
    }
    facility.address = address;
    facility.bankDetails = bankDetails;
    facility.businessContact = businessContact;
    facility.itContact = itContact;
    facility.employer = employer;
    facility.email = this.employerFormGroup.controls['email'].value;
    facility.name = this.employerFormGroup.controls['employerName'].value;
    facility.phoneNumber = this.employerFormGroup.controls['phone'].value;
    facility.facilityType = this.selectedUserType;

    return facility;
  }

  onClickSaveEmployer(value: any, valid: boolean) {
    if (valid) {
      this._systemService.on();
      this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";
      let facility = this._extractFacility();
      this._facilityService.create(facility).then(payload => {
        this.employerFormGroup.reset();
        this._systemService.off();
        this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
        this._toastr.success('Employer has been created successfully!', 'Success!');
      }).catch(err => {
        this._systemService.off();
      });

    } else {
      this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
    }
  }

  _getIndustries() {
    this._systemService.on();
    this._industryService.find({}).then((payload: any) => {
      this._systemService.off();
      this.industries = payload.data;
      if (this.facility !== undefined) {
        console.log('indus')
        console.log(this.facility.employer.industry)
        this.employerFormGroup.controls['type'].setValue(this.facility.employer.industry);
      }
    }).catch(err => {
      this._systemService.off();
    })
  }

}
