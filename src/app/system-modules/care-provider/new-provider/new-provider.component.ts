import { Provider } from './../../../models/organisation/provider';
import { FacilityOwnershipService } from './../../../services/common/facility-ownership.service';
import { FacilityCategoryService } from './../../../services/common/facility-category.service';
import { UserTypeService } from './../../../services/api-services/setup/user-type.service';
import { BankDetail } from './../../../models/organisation/bank-detail';
import { Address } from './../../../models/organisation/address';
import { HIA } from './../../../models/organisation/hia';
import { Contact } from './../../../models/organisation/contact';
import { CountryService } from './../../../services/common/country.service';
import { BankService } from './../../../services/common/bank.service';
import { ContactPositionService } from './../../../services/common/contact-position.service';
import { Facility } from './../../../models/organisation/facility';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { CountriesService, FacilityTypesService, FacilitiesService, HiaPositionService, OwnershipService } from '../../../services/api-services/index';
import { CareProvider } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GRADES, HEFAMAA_STATUSES } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ///^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
	selector: 'app-new-provider',
	templateUrl: './new-provider.component.html',
	styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent implements OnInit {
	providerFormGroup: FormGroup;
	positions: any = [];
	lgas: any = [];
	countryId: string = "";
	stateId: string = "";
	facilityCategories: any = [];
	grades: any = GRADES;
	ownerships: any = [];
	countries: any[] = [];
	states: any[] = [];
	lgs: any[] = [];
	cities: any[] = [];
	banks: any[] = [];
	userTypes: any[] = [];
	contactPositions: any[] = [];
	HEFAMAA_STATUSES: any = HEFAMAA_STATUSES;
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	selectedUserType: any;
	selectedCountry: any;
	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _facilityService: FacilitiesService,
		private _positionService: HiaPositionService,
		private _countryService: CountriesService,
		private _facilityTypeService: FacilityTypesService,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _ownershipService: OwnershipService,
		private _userTypeService: UserTypeService,
		private _contactPositionService: ContactPositionService,
		// private _platformOwnerService: FacilityService,
		private _bankService: BankService,
		private _countriesService: CountryService,
		private _facilityCategoryService: FacilityCategoryService,
		private _facilityOwnershipService: FacilityOwnershipService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Provider');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._getContactPositions();
		this._getCountries();
		this._getBanks();
		this._getFacilityCategories();
		this._getFacilityOwnerships();
		this._getUserTypes();

		this.providerFormGroup = this._fb.group({
			providerName: ['', [<any>Validators.required]],
			email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			address: ['', [<any>Validators.required]],
			state: ['', [<any>Validators.required]],
			lga: ['', [<any>Validators.required]],
			city: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required]],
			bc_fname: ['', [<any>Validators.required]],
			bc_lname: ['', [<any>Validators.required]],
			bc_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			bc_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			bc_position: ['', [<any>Validators.required]],
			it_fname: ['', [<any>Validators.required]],
			it_lname: ['', [<any>Validators.required]],
			it_position: ['', [<any>Validators.required]],
			it_email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
			it_phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
			type: ['', [<any>Validators.required]],
			lasrraId: ['', [<any>Validators.required]],
			hefeemaNumber: ['', [<any>Validators.required]],
			hefeemaStatus: ['', [<any>Validators.required]],
			bank: [ [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required]],
			classification: ['', [<any>Validators.required]],
			grade: ['', [<any>Validators.required]],
			ownership: ['', [<any>Validators.required]],
			comment: ['', [<any>Validators.required]]
		});

		this.providerFormGroup.controls['state'].valueChanges.subscribe(value => {
			console.log(value)
			this._getLgaAndCities(this.selectedCountry._id, value);
		});
		this.providerFormGroup.controls['classification'].setValue('primary');

	}
	_getContactPositions() {
		this._contactPositionService.find({}).then((payload: any) => {
			this.contactPositions = payload.data;
			console.log(this.contactPositions)
		})
	}
	_getUserTypes() {
		this._userTypeService.findAll().then((payload: any) => {
			if (payload.data.length > 0) {
				console.log(payload.data)
				this.userTypes = payload.data;
				const index = payload.data.findIndex(x => x.name === 'Provider');
				if (index > -1) {
					this.selectedUserType = payload.data[index];
					this.providerFormGroup.controls['type'].setValue(this.selectedUserType);
				} else {
					this.selectedUserType = undefined;
					this.providerFormGroup.controls['type'].reset();
				}
				console.log(this.selectedUserType);
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
		businessContact.lastName = this.providerFormGroup.controls['bc_fname'].value;
		businessContact.firstName = this.providerFormGroup.controls['bc_lname'].value;
		businessContact.email = this.providerFormGroup.controls['bc_email'].value;
		businessContact.phoneNumber = this.providerFormGroup.controls['bc_phone'].value;
		businessContact.position = this.providerFormGroup.controls['bc_position'].value;
		return businessContact;
	}
	_extractITContact(itContact?: Contact) {
		if (itContact === undefined) {
			itContact = <Contact>{};
		}
		itContact.lastName = this.providerFormGroup.controls['it_fname'].value;
		itContact.firstName = this.providerFormGroup.controls['it_lname'].value;
		itContact.email = this.providerFormGroup.controls['it_email'].value;
		itContact.phoneNumber = this.providerFormGroup.controls['it_phone'].value;
		itContact.position = this.providerFormGroup.controls['it_position'].value;
		return itContact;
	}
	_extractBankDetail(bankDetail?: BankDetail) {
		if (bankDetail === undefined) {
			bankDetail = <BankDetail>{};
		}
		bankDetail.accountNumber = this.providerFormGroup.controls['bankAccNumber'].value;
		bankDetail.bank = this.providerFormGroup.controls['bank'].value;
		bankDetail.name = this.providerFormGroup.controls['bankAccName'].value;
		return bankDetail;
	}

	_extractAddress(address?: Address) {
		if (address === undefined) {
			address = <Address>{};
		}
		address.city = this.providerFormGroup.controls['city'].value;
		address.lga = this.providerFormGroup.controls['lga'].value;
		address.neighbourhood = this.providerFormGroup.controls['neighbourhood'].value;
		address.state = this.providerFormGroup.controls['state'].value;
		address.street = this.providerFormGroup.controls['address'].value;
		return address;
	}
	_extractProvider(provider?: Provider) {
		if (provider === undefined) {
			provider = <Provider>{};
		}

		provider.facilityOwnership = this.providerFormGroup.controls['ownership'].value;
		provider.facilityType = this.providerFormGroup.controls['type'].value;
		provider.facilityClass = this.providerFormGroup.controls['classification'].value;
		provider.hefeemaNumber = this.providerFormGroup.controls['hefeemaNumber'].value;
		provider.hefeemaStatus = this.providerFormGroup.controls['hefeemaStatus'].value;
		provider.lasrraId = this.providerFormGroup.controls['lasrraId'].value;
		return provider;
	}

	_extractFacility(facility?: Facility) {
		const businessContact = this._extractBusinessContact();
		const itContact = this._extractITContact();
		const bankDetails = this._extractBankDetail();
		const address = this._extractAddress();
		const provider = this._extractProvider();

		if (facility === undefined) {
			facility = <Facility>{};
		}
		facility.address = address;
		facility.bankDetails = bankDetails;
		facility.businessContact = businessContact;
		facility.itContact = itContact;
		facility.provider = provider;
		facility.email = this.providerFormGroup.controls['email'].value;
		// facility.website = this.providerFormGroup.controls['website'].value;
		// facility.shortName = this.providerFormGroup.controls['shortName'].value;
		facility.facilityType = this.selectedUserType;

		return facility;
	}

	_getFacilityCategories() {
		this._facilityCategoryService.find({}).then((payload: any) => {
			this.facilityCategories = payload.data;
		});
	}

	_getFacilityOwnerships() {
		this._facilityOwnershipService.find({}).then((payload: any) => {
			this.ownerships = payload.data;
		});
	}

	onClickSaveProvider(value: any, valid: boolean) {
		//if(valid) {
		console.log(value);
		console.log(this._extractFacility());
		this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";

		// let bankDetails = {
		// 	name: this.providerFormGroup.controls['bankAccName'].value,
		// 	accountNo: this.providerFormGroup.controls['bankAccNumber'].value,
		// }

		// let address = {
		// 	street: this.providerFormGroup.controls['address'].value,
		// 	lga: this.providerFormGroup.controls['lga'].value._id,
		// 	state: this.stateId,
		// 	country: this.countryId,
		// }

		// let careProvider = <CareProvider>{
		// 	name: this.providerFormGroup.controls['providerName'].value,
		// 	email: this.providerFormGroup.controls['contactEmail'].value,
		// 	contactPhoneNo: this.providerFormGroup.controls['contactNumber'].value,
		// 	contactFullName: this.providerFormGroup.controls['contactName'].value,
		// 	facilityTypeId: this.providerFormGroup.controls['type'].value._id,
		// 	lshmClassification: this.providerFormGroup.controls['classification'].value,
		// 	bankDetails: bankDetails,
		// 	address: address,
		// 	isTokenVerified: false,
		// 	isLshma: true,
		// 	//logo: this.providerFormGroup.controls['providerName'].value,
		// 	//logoObject: this.providerFormGroup.controls['providerName'].value,
		// 	lasrraId: this.providerFormGroup.controls['lasrraId'].value,
		// 	hefeemaNo: this.providerFormGroup.controls['hefeemaNumber'].value,
		// 	hefeemaStatus: this.providerFormGroup.controls['hefeemaStatus'].value,
		// 	gradeId: this.providerFormGroup.controls['grade'].value,
		// 	facilityOwnershipId: this.providerFormGroup.controls['ownership'].value._id
		// }

		// console.log(careProvider);

		// this._facilityService.create(careProvider).then(payload => {
		// 	console.log(payload);
		// 	this.providerFormGroup.reset();
		// 	this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
		// 	this._toastr.success('Care Provider has been created successfully!', 'Success!');
		// }).catch(err => {
		// 	console.log(err);
		// 	if (err == "Error: This email already exist") {
		// 		this._toastr.error('This email alreay exist!', 'Email exists!');
		// 	} else {
		// 		this._toastr.error('We could not save your data. Something went wrong!', 'Error!');
		// 	}
		// });

		// } else {
		// 	this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		// }
	}

}
