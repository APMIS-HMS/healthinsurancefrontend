import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { HiaPositionService, CorporateFacilityService, HiaProgramService, 
	IndustryTypesService, CountriesService } from '../../../services/api-services/index';
import { Employer } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.scss']
})
export class NewEmployerComponent implements OnInit {
	employerFormGroup: FormGroup;
	countryId: string = "";
	stateId: string = "";
	lgas: any = [];
	positions: any = [];
	types: any = [];
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _corporateService: CorporateFacilityService,
		private _positionService: HiaPositionService,
		private _countryService: CountriesService,
		private _industryTypeService: IndustryTypesService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Employer');
    	this._headerEventEmitter.setMinorRouteUrl('');

		this.getHiaPositions();
		this.getIndustyTypes();
		this.getCountries();

		this.employerFormGroup = this._fb.group({
			employerName: ['', [<any>Validators.required]],
			address: ['', [<any>Validators.required]],
			lga: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required]],
			contactName: ['', [<any>Validators.required]],
			contactNumber: ['', [<any>Validators.required]],
			contactPosition: ['', [<any>Validators.required]],
			contactEmail:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			type: ['', [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required]],
			cacNumber: ['', [<any>Validators.required]],
			cinNumber: ['', [<any>Validators.required]]
		});
	}

	onClickSaveEmployer(value: any, valid: boolean) {
		if(valid) {
			this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";

			let bankDetails = {
				name: this.employerFormGroup.controls['bankAccName'].value,
				accountNo: this.employerFormGroup.controls['bankAccNumber'].value,
			}

			let address = {
				street: this.employerFormGroup.controls['address'].value,
				lga: this.employerFormGroup.controls['lga'].value._id,
				state: this.stateId,
				country: this.countryId,
			}

			let employer = {
		  		name: this.employerFormGroup.controls['employerName'].value,
				email: this.employerFormGroup.controls['contactEmail'].value,
				address: address,
				contactPhoneNo: this.employerFormGroup.controls['contactNumber'].value,
				contactFullName: this.employerFormGroup.controls['contactName'].value,
				contactPositionId: this.employerFormGroup.controls['contactPosition'].value._id,
				neighbourhood: this.employerFormGroup.controls['neighbourhood'].value,
				phoneNumber: this.employerFormGroup.controls['phone'].value,
				industryTypeId: this.employerFormGroup.controls['type'].value._id,
				bankDetails: bankDetails,
				isLshma: true,
				cacNumber: this.employerFormGroup.controls['cacNumber'].value,
				cinNumber: this.employerFormGroup.controls['cinNumber'].value
        	}

			this._corporateService.create(employer).then(payload => {
				this.employerFormGroup.reset();
				this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
				this._toastr.success('Employer has been created successfully!', 'Success!');
			}).catch(err => {
				console.log(err);
			});

		 } else {
			this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		 }
	}

	getIndustyTypes() {
		this._industryTypeService.findAll().then((payload: any) => {
			this.types = payload.data;
		});
	}
	
	getHiaPositions() {
		this._positionService.findAll().then((payload: any) => {
			this.positions = payload.data;
		});
	}

	getCountries() {
		this._countryService.findAll().then((payload: any) => {
			for(var i=0; i<payload.data.length; i++) {
				let country = payload.data[i];
				if(country.name === "Nigeria") {
					this.countryId = country._id;
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

}
