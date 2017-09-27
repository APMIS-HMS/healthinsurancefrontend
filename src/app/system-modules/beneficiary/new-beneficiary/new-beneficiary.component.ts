import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilityTypesService, FacilitiesService, GenderService,
  PersonService, TitleService, UserService, MaritalStatusService, HiaService
} from '../../../services/api-services/index';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit {
	stepOneView: Boolean = true;
	stepTwoView: Boolean = false;
	stepThreeView: Boolean = false;
	stepFourView: Boolean = false;
	stepOneFormGroup: FormGroup;
	stepTwoFormGroup: FormGroup;
	stepThreeFormGroup: FormGroup;

	tab_personalData = true;
	tab_dependants= false;
	tab_program = false;
	tab_confirm = false;

	selectedFacility: any[] = [];
	states: any[] = [];
	titles: Title[] = [];
	genders: Gender[] = [];
	cities: any[] = [];
	lgas: any[] = [];
	selectedLgas: any[] = [];
	selectedStateId: String = '';
	maritalStatuses: MaritalStatus[] = [];
	providers: any[] = [];
	hias: any[] = [];
	beneficiary: any = <Beneficiary>{};
	countryId: String = '';
	stateId: String = '';
	saveBtn: String = '&nbsp;&nbsp; SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

	constructor(
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _fb: FormBuilder,
		private _countriesService: CountriesService,
		private _genderService: GenderService,
		private _titleService: TitleService,
		private _maritalStatusService: MaritalStatusService,
		private _userService: UserService,
		private _personService: PersonService,
		private _facilityService: FacilitiesService,
		private _hiaService: HiaService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Beneficiary');
    	this._headerEventEmitter.setMinorRouteUrl('');

		this.getCountries();
		this.getTitles();
		this.getGenders();
		this.getMaritalStatus();
		this.getAllProviders();
		this.getAllHias();

		this.stepOneFormGroup = this._fb.group({
			gender: [''],
			title: ['', [<any>Validators.required]],
			firstName: ['', [<any>Validators.required]],
			middleName: [''],
			lastName: ['', [<any>Validators.required]],
			email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			dob: ['', [<any>Validators.required]],
			lasrraId: [''],
			stateOfOrigin: ['', [<any>Validators.required]],
			lgaOfOrigin: ['', [<any>Validators.required]],
			maritalStatus: ['', [<any>Validators.required]],
			noOfChildrenU18: ['', [<any>Validators.required]],
			noOfDependents: ['', [<any>Validators.required]],
			streetName: ['', [<any>Validators.required]],
			lga: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phonenumber: ['', [<any>Validators.required]],
			secondaryPhone: [''],
		});
		this.stepTwoFormGroup = this._fb.group({
			spouseFirstName: ['', [<any>Validators.required]],
			spouseMiddleName: [''],
			spouseLastName: ['', [<any>Validators.required]],
			spouseDob: ['', [<any>Validators.required]],
			spouseLassraId: [''],
			child_1_gender: ['', [<any>Validators.required]],
			child_1_firstName: ['', [<any>Validators.required]],
			child_1_middleName: ['', [<any>Validators.required]],
			child_1_lastName: ['', [<any>Validators.required]],
			child_1_dob: ['', [<any>Validators.required]],
			child_2_gender: ['', [<any>Validators.required]],
			child_2_firstName: ['', [<any>Validators.required]],
			child_2_middleName: [''],
			child_2_lastName: ['', [<any>Validators.required]],
			child_2_dob: ['', [<any>Validators.required]],
			dependant_1_gender: ['', [<any>Validators.required]],
			dependant_1_firstName: ['', [<any>Validators.required]],
			dependant_1_middleName: [''],
			dependant_1_lastName: ['', [<any>Validators.required]],
			dependant_1_dob: ['', [<any>Validators.required]],
			dependant_1_lassraId: [''],
			dependant_1_relationship: ['', [<any>Validators.required]],
		});
		this.stepThreeFormGroup = this._fb.group({
			hiaName: [''],
			programType: ['', [<any>Validators.required]],
			programName: ['', [<any>Validators.required]],
			providerName: ['', [<any>Validators.required]]
		});
	}

	tabConfirm_click(){
		this.tab_personalData = false;
		this.tab_dependants= false;
		this.tab_program = false;
		this.tab_confirm = true;
	}
	tabProgram_click(){
		this.tab_personalData = false;
		this.tab_dependants= false;
		this.tab_program = true;
		this.tab_confirm = false;
	}
	tabDependants_click(){
		this.tab_personalData = false;
		this.tab_dependants= true;
		this.tab_program = false;
		this.tab_confirm = false;
	}
	tabPersonalData_click(){
		this.tab_personalData = true;
		this.tab_dependants= false;
		this.tab_program = false;
		this.tab_confirm = false;
	}

	populateStepFour() {
		this.beneficiary.fullName =  this.stepOneFormGroup.controls['title'].value.name
									+ " " + this.stepOneFormGroup.get('firstName').value
									 + " " + this.stepOneFormGroup.get('middleName').value
									 + " " + this.stepOneFormGroup.get('lastName').value;
		this.beneficiary.phonenumber = this.stepOneFormGroup.get('phonenumber').value;
		this.beneficiary.dob = this.stepOneFormGroup.get('dob').value;
		this.beneficiary.lga = this.stepOneFormGroup.get('lga').value.name;
		this.beneficiary.gender = this.stepOneFormGroup.get('gender').value;
		this.beneficiary.lasrraId = this.stepOneFormGroup.get('lasrraId').value;

		this.beneficiary.spouseFullName =  this.stepTwoFormGroup.get('spouseFirstName').value
									 + " " + this.stepTwoFormGroup.get('spouseMiddleName').value
									 + " " + this.stepTwoFormGroup.get('spouseLastName').value;
		this.beneficiary.spouseDob = this.stepTwoFormGroup.get('spouseDob').value;
		this.beneficiary.spouseLassraId = this.stepTwoFormGroup.get('spouseLassraId').value;

		this.beneficiary.child_1_gender = this.stepTwoFormGroup.get('child_1_gender').value;
		this.beneficiary.child_1_fullName =  this.stepTwoFormGroup.get('child_1_firstName').value
									 + " " + this.stepTwoFormGroup.get('child_1_middleName').value
									 + " " + this.stepTwoFormGroup.get('child_1_lastName').value;
		this.beneficiary.child_1_dob = this.stepTwoFormGroup.get('child_1_dob').value;

		this.beneficiary.child_2_gender = this.stepTwoFormGroup.get('child_2_gender').value;
		this.beneficiary.child_2_fullName =  this.stepTwoFormGroup.get('child_2_firstName').value
									 + " " + this.stepTwoFormGroup.get('child_2_middleName').value
									 + " " + this.stepTwoFormGroup.get('child_2_lastName').value;
		this.beneficiary.child_2_dob = this.stepTwoFormGroup.get('child_2_dob').value;

		this.beneficiary.dependant_1_gender = this.stepTwoFormGroup.get('dependant_1_gender').value;
		this.beneficiary.dependant_1_fullName =  this.stepTwoFormGroup.get('dependant_1_firstName').value
									 + " " + this.stepTwoFormGroup.get('dependant_1_middleName').value
									 + " " + this.stepTwoFormGroup.get('dependant_1_lastName').value;
		this.beneficiary.dependant_1_dob = this.stepTwoFormGroup.get('dependant_1_dob').value;
		this.beneficiary.dependant_1_lassraId = this.stepTwoFormGroup.get('dependant_1_lassraId').value;
		this.beneficiary.dependant_1_relationship = this.stepTwoFormGroup.get('dependant_1_relationship').value;

		this.beneficiary.hiaName = this.stepThreeFormGroup.get('hiaName').value;
		this.beneficiary.programType = this.stepThreeFormGroup.get('programType').value;
		this.beneficiary.programName = this.stepThreeFormGroup.get('programName').value;
		this.beneficiary.providerName = this.stepThreeFormGroup.get('providerName').value;

		console.log(this.beneficiary);
		console.log(this.stepOneFormGroup.get('title'));
	}

	onClickConfirm() {
		let person = <Person>{
			titleId: this.stepOneFormGroup.controls['title'].value._id,
			firstName: this.stepOneFormGroup.controls['firstName'].value,
			lastName: this.stepOneFormGroup.controls['lastName'].value,
			genderId: this.stepOneFormGroup.controls['gender'].value,
			homeAddress: <Address> {
				street: this.stepOneFormGroup.controls['streetName'].value,
				lga: this.stepOneFormGroup.controls['lga'].value,
				city:'',
				neighbourhood:'',
				state: this.stateId,
				country: this.countryId,
			},
			phoneNumber: this.stepOneFormGroup.controls['phonenumber'].value,
			lgaOfOriginId: this.stepOneFormGroup.controls['lgaOfOrigin'].value,
			nationalityId: this.countryId,
			stateOfOriginId: this.stepOneFormGroup.controls['stateOfOrigin'].value,
			email: this.stepOneFormGroup.controls['email'].value,
			maritalStatusId: this.stepOneFormGroup.controls['maritalStatus'].value
		};

		let patient = {
			personId: "personId",
			facilityId: this.stepThreeFormGroup.get('providerName').value,
			isActive: false,
			orders:[],
			tags:[]
		}

		let beneficiary = {
			facilityId: this.stepThreeFormGroup.get('providerName').value,  
			patientId: "patientId",
			lasrraId: this.stepThreeFormGroup.get('lasrraId').value,
			noOfChildrenUnder18: this.stepOneFormGroup.get('noOfChildrenU18').value,
			spouse: {
			// 	spouseFirstName: ['', [<any>Validators.required]],
			// spouseMiddleName: [''],
			// spouseLastName: ['', [<any>Validators.required]],
			// spouseDob: ['', [<any>Validators.required]],
			// spouseLassraId: [''],
				// patientId: ,
				// relationshipId: ,
				// lasrraId:  ,
			},
			hiaId: this.stepThreeFormGroup.get('hiaName').value,
			hiaProgramTypeId: this.stepThreeFormGroup.get('programType').value,
			hiaNameId: this.stepThreeFormGroup.get('programName').value,
			phcpId: this.stepThreeFormGroup.get('providerName').value,
			dependants: [ 
				// {
				// 	patientId: ,
				// 	relationshipId: ,
				// 	lasrraId:  ,
				// },
				// {
				// 	patientId: ,
				// 	relationshipId: ,
				// 	lasrraId:  ,
				// }
			],
		}

		console.log(person);
		console.log(patient);
		console.log(beneficiary);

		// this._personService.create(person).then((res) => {
		// 	console.log(res);

		// 	let patient = {
		// 		personId: res._id,
		// 		facilityId: this.stepThreeFormGroup.get('providerName').value,
		// 		isActive:{ type: Boolean, 'default': false },
		// 		orders:[{type: String, required: false}],
		// 		tags:[{type: String, required: false}]
		// 	}
		// 	if(res) {

		// 	}
		// 	this.stepOneFormGroup.reset();
		// 	this.stepTwoFormGroup.reset();
		// 	this.stepThreeFormGroup.reset();
		// 	this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
		// 	this._toastr.success('Beneficiary has been created successfully!', 'Success!');
		// });
	}

	getCountries() {
		this._countriesService.findAll().then((payload) => {
			for(let i=0; i<payload.data.length; i++) {
				let country = payload.data[i];
				if(country.name === "Nigeria") {
					this.countryId = country._id;
					this.states = country.states;
					for(let j = 0; j < country.states.length; j++) {
						let state = country.states[j];
						if(state.name === "Lagos") {
							this.stateId = state._id;
							this.lgas = state.lgs;
							return;
						}
					}
					return;
				}
			}
		});
	}
	getGenders() {
		this._genderService.findAll().then((payload) => {
			this.genders = payload.data;
		})
	}

	getTitles() {
		this._titleService.findAll().then((payload: any) => {
			this.titles = payload.data;
		})
	}

	getMaritalStatus() {
		this._maritalStatusService.findAll().then((payload: any) => {
			this.maritalStatuses = payload.data;
		})
	}
	
	getAllProviders() {
		this._facilityService.findAll().then(payload => {
			console.log(payload);
			this.providers = payload.data;
		});
	}
	
	getAllHias() {
		this._hiaService.findAll().then(payload => {
			console.log(payload);
			this.hias = payload.data;
		});
	}

	onChangeStateOfOrigin(value: any) {
		this._countriesService.findAll().then((payload) => {
			for(let i=0; i<payload.data.length; i++) {
				let country = payload.data[i];
				if(country.name === "Nigeria") {
					for(let j = 0; j < country.states.length; j++) {
						let state = country.states[j];
						if(state._id === value) {
							this.selectedStateId = state._id;
							this.selectedLgas = state.lgs;
							return;
						}
					}
					return;
				}
			}
		});
	}

	onClickStepOne(value: any, valid: boolean){
		event.preventDefault();
		
		console.log(value);
		console.log(valid);
		//if(valid) {
			this.stepOneView = false;
			this.stepTwoView = true;
			this.stepThreeView = false;
			this.stepFourView = false;
		// } else {
		// 	this.toastr.error('You have successfully logged in!', 'Success!');
		// }
	}
		
	onClickStepTwo(value: any, valid: boolean){
		event.preventDefault();
		
		console.log(value);
		console.log(valid);
		//if(valid) {
			this.stepOneView = false;
			this.stepTwoView = false;
			this.stepThreeView = true;
			this.stepFourView = false;
		// } else {
		// 	this.toastr.error('You have successfully logged in!', 'Success!');
		// }
	}
	
	onClickStepThree(value: any, valid: boolean){
		event.preventDefault();
		
		console.log(value);
		console.log(valid);
		this.stepThreeFormGroup.get('providerName').value;
		//if(valid) {
			this.stepOneView = false;
			this.stepTwoView = false;
			this.stepThreeView = false;
			this.stepFourView = true;
			this.populateStepFour();
		// } else {
		// 	this.toastr.error('You have successfully logged in!', 'Success!');
		// }
	}

	onClickPrevStepOne() {
		event.preventDefault();
		this.stepOneView = true;
		this.stepTwoView = false;
		this.stepThreeView = false;
		this.stepFourView = false;
	}
	
	onClickPrevStepTwo() {
		event.preventDefault();
		this.stepOneView = false;
		this.stepTwoView = true;
		this.stepThreeView = false;
		this.stepFourView = false;
	}
	
	onClickPrevStepThree() {
		event.preventDefault();
		this.stepOneView = false;
		this.stepTwoView = false;
		this.stepThreeView = true;
		this.stepFourView = false;
	}

}
