import { FacilityService } from './../../../services/common/facility.service';
import { IndustryService } from './../../../services/common/industry.service';
import { Employer } from './../../../models/organisation/employer';
import { Address } from './../../../models/organisation/address';
import { BankDetail } from './../../../models/organisation/bank-detail';
import { Contact } from './../../../models/organisation/contact';
import { CountryService } from './../../../services/common/country.service';
import { BankService } from './../../../services/common/bank.service';
import { ContactPositionService } from './../../../services/common/contact-position.service';
import { UserTypeService } from './../../../services/api-services/setup/user-type.service';
import { OwnershipService } from './../../../services/api-services/setup/ownership.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
	HiaPositionService, CorporateFacilityService, HiaProgramService,
	IndustryTypesService, CountriesService
} from '../../../services/api-services/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { Facility } from './../../../models/organisation/facility';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ///^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
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
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	selectedUserType: any;
	selectedCountry: any;

	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _corporateService: CorporateFacilityService,
		private _industryService: IndustryService,
		private _ownershipService: OwnershipService,
		private _userTypeService: UserTypeService,
		private _contactPositionService: ContactPositionService,
		private _facilityService: FacilityService,
		private _bankService: BankService,
		private _countriesService: CountryService,

	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Employer');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._getIndustries();

		this._getContactPositions();
		this._getCountries();
		this._getBanks();
		this._getUserTypes();

		this.employerFormGroup = this._fb.group({
			employerName: ['', [<any>Validators.required]],
			address: ['', [<any>Validators.required]],
			email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			state: ['', [<any>Validators.required]],
			city: ['', [<any>Validators.required]],
			lga: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			bc_lname: ['', [<any>Validators.required]],
			bc_fname: ['', [<any>Validators.required]],
			bc_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			bc_position: ['', [<any>Validators.required]],
			bc_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			it_lname: ['', [<any>Validators.required]],
			it_fname: ['', [<any>Validators.required]],
			it_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			it_position: ['', [<any>Validators.required]],
			it_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			type: ['', [<any>Validators.required]],
			bank: ['', [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
			cacNumber: ['', [<any>Validators.required]],
			cinNumber: ['', [<any>Validators.required]]
		});

		this.employerFormGroup.controls['state'].valueChanges.subscribe(value => {
			if (value !== null) {
				this._getLgaAndCities(this.selectedCountry._id, value);
			}
		});
	}

	_getContactPositions() {
		this._contactPositionService.find({}).then((payload: any) => {
			this.contactPositions = payload.data;
		})
	}
	_getUserTypes() {
		this._userTypeService.findAll().then((payload: any) => {
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

		})
	}
	_getCountries() {
		this._countriesService.find({
			query: {
				$limit: 200,
				$select: { "states": 0 }
			}
		}).then((payload: any) => {
			this.countries = payload.data;
			const index = this.countries.findIndex(x => x.name === 'Nigeria');
			if (index > -1) {
				this.selectedCountry = this.countries[index];
				this._getStates(this.selectedCountry._id);
			}
		})
	}
	_getStates(_id) {
		this._countriesService.find({
			query: {
				_id: _id,
				$limit: 200,
				$select: { "states.cities": 0, "states.lgs": 0 }
			}
		}).then((payload: any) => {
			if (payload.data.length > 0) {
				this.states = payload.data[0].states;
			}

		}).catch(error => {

		})
	}

	_getLgaAndCities(_id, state) {
		this._countriesService.find({
			query: {
				_id: _id,
				"states.name": state.name,
				$select: { 'states.$': 1 }
			}
		}).then((payload: any) => {
			if (payload.data.length > 0) {
				const states = payload.data[0].states;
				if (states.length > 0) {
					this.cities = states[0].cities;
					this.lgs = states[0].lgs;
				}
			}

		}).catch(error => {

		})
	}
	_getBanks() {
		this._bankService.find({
			query: {
				$limit: 200
			}
		}).then((payload: any) => {
			this.banks = payload.data;
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
			this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";
			let facility = this._extractFacility();
			this._facilityService.create(facility).then(payload => {
				this.employerFormGroup.reset();
				this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
				this._toastr.success('Employer has been created successfully!', 'Success!');
			}).catch(err => {
			});

		} else {
			this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		}
	}

	_getIndustries() {
		this._industryService.find({}).then((payload: any) => {
			this.industries = payload.data;
		});
	}

}
