import { HIA } from './../../../models/organisation/hia';
import { FacilityService } from './../../../models/setup/facilityservice';
import { CountryService } from './../../../services/common/country.service';
import { BankService } from './../../../services/common/bank.service';
import { ContactPositionService } from './../../../services/common/contact-position.service';
import { UserTypeService } from './../../../services/api-services/setup/user-type.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
	CountriesService, FacilityTypesService, FacilitiesService, GenderService, PersonService, TitleService, UserService,
	MaritalStatusService, HiaService, HiaNameService, HiaProgramService, HiaPlanService, HiaPositionService
} from '../../../services/api-services/index';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary, Hia, Contact, BankDetail } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

// import { Contact, BankDetail } from '../../../models/index';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ///^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
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
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	selectedUserType: any;
	selectedCountry: any;

	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _hiaService: HiaService,
		private _hiaProgramService: HiaProgramService,
		private _hiaPlanService: HiaPlanService,
		private _hiaPositionService: HiaPositionService,
		private _userTypeService: UserTypeService,
		private _contactPositionService: ContactPositionService,
		// private _platformOwnerService: FacilityService,
		private _bankService: BankService,
		private _countriesService: CountryService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New HIA');
		this._headerEventEmitter.setMinorRouteUrl('');

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
			businessContactFirstName:['', [<any>Validators.required]],
			businessContactNumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			businessContactPosition: ['', [<any>Validators.required]],
			businessContactEmail: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			iTContactName: ['', [<any>Validators.required]],
			iTContactFirstName:['', [<any>Validators.required]],
			iTContactNumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			iTContactPosition: ['', [<any>Validators.required]],
			iTContactEmail: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			type: ['', [<any>Validators.required]],
			bank: ['', [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required]],
			// plan: ['', [<any>Validators.required]],
			// plan2: ['', [<any>Validators.required]],
			// plan3: ['', [<any>Validators.required]],
			nhisNumber: ['', [<any>Validators.required]],
			cinNumber: ['', [<any>Validators.required]],
			registrationDate: ['', [<any>Validators.required]]
		});

		this._getContactPositions();
		this._getUserTypes();
		this._getBanks();
		this._getCountries();

		this.hiaFormGroup.controls['state'].valueChanges.subscribe(value => {
			console.log(value)
			this._getLgaAndCities(this.selectedCountry._id, value);
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
			console.log(payload)
			const index = this.countries.findIndex(x => x.name === 'Nigeria');
			console.log(index)
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
			console.log(payload.data)
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
			console.log(this.banks)
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
	_extractHIA(hia?:HIA){
		if (hia === undefined) {
			hia = <HIA>{};
		}
		hia.nhisNumber =this.hiaFormGroup.controls['nhisNumber'].value;
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
		// facility.website = this.hiaFormGroup.controls['website'].value;
		// facility.shortName = this.hiaFormGroup.controls['shortName'].value;
		facility.facilityType = this.selectedUserType;

		return facility;
	}

	onClickSaveHia(value: any, valid: boolean) {
		console.log(value);
		if (valid) {
			this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";
			console.log(this._extractFacility());
			// let businessContact = {
			// 	name: this.hiaFormGroup.controls['businessContactName'].value,
			// 	phone: this.hiaFormGroup.controls['businessContactNumber'].value,
			// 	positionId: this.hiaFormGroup.controls['businessContactPosition'].value._id,
			// 	email: this.hiaFormGroup.controls['businessContactEmail'].value,
			// }

			// let iTContact = {
			// 	name: this.hiaFormGroup.controls['iTContactName'].value,
			// 	phone: this.hiaFormGroup.controls['iTContactNumber'].value,
			// 	positionId: this.hiaFormGroup.controls['iTContactPosition'].value._id,
			// 	email: this.hiaFormGroup.controls['iTContactEmail'].value,
			// }
			// let bankDetails = {
			// 	name: this.hiaFormGroup.controls['bankAccName'].value,
			// 	accountNo: this.hiaFormGroup.controls['bankAccNumber'].value,
			// }

			// let plan = {
			// 	planId: this.hiaFormGroup.controls['plan'].value._id
			// };
			// this.plans.push(plan);

			// let hia = <Hia>{
			// 	agentName: this.hiaFormGroup.controls['agentName'].value,
			// 	address: this.hiaFormGroup.controls['address'].value,
			// 	neighbourhood: this.hiaFormGroup.controls['neighbourhood'].value,
			// 	phoneNumber: this.hiaFormGroup.controls['phone'].value,
			// 	businessContact: businessContact,
			// 	itContact: iTContact,
			// 	hiaTypeId: this.hiaFormGroup.controls['type'].value._id,
			// 	bankDetails: bankDetails,
			// 	hiaPlanIds: this.plans,
			// 	nhisNo: this.hiaFormGroup.controls['nhisNumber'].value,
			// 	cinNo: this.hiaFormGroup.controls['cinNumber'].value,
			// 	registrationDate: this.hiaFormGroup.controls['registrationDate'].value
			// }

			// this._hiaService.create(hia).then(payload => {
			// 	this.hiaFormGroup.reset();
			// 	this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
			// 	this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
			// }).catch(err => {
			// 	console.log(err);
			// });

		} else {
			this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		}
	}

	_getUserTypes() {
		this._userTypeService.findAll().then((payload: any) => {
			if (payload.data.length > 0) {
				console.log(payload.data)
				this.userTypes = payload.data;
				const index = payload.data.findIndex(x => x.name === 'Health Insurance Agent');
				if (index > -1) {
					this.selectedUserType = payload.data[index];
					this.hiaFormGroup.controls['type'].setValue(this.selectedUserType);
				} else {
					this.selectedUserType = undefined;
					this.hiaFormGroup.controls['type'].reset();
				}
				console.log(this.selectedUserType);
			}
		}, error => {

		})
	}

	_getHiaPlans() {
		this._hiaPlanService.findAll().then((payload: any) => {
			this.hiaPlans = payload.data;
		});
	}

	_getContactPositions() {
		this._contactPositionService.find({}).then((payload: any) => {
			this.contactPositions = payload.data;
			console.log(payload)
		});
	}
}
