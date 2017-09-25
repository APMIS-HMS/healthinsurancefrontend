import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { CountriesService, FacilityTypesService, FacilitiesService, HiaPositionService, OwnershipService } from '../../../services/api-services/index';
import { CareProvider } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GRADES, HEFAMAA_STATUSES } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {

  providerFormGroup: FormGroup;
	positions: any = [];
	lgas: any = [];
	countryId: string = "";
	stateId: string = "";
	facilityTypes: any = [];
	grades: any = GRADES;
	ownerships: any = [];
	HEFAMAA_STATUSES: any = HEFAMAA_STATUSES;
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _facilityService: FacilitiesService,
		private _positionService: HiaPositionService,
		private _countryService: CountriesService,
		private _facilityTypeService: FacilityTypesService,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _ownershipService: OwnershipService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Plan');
    this._headerEventEmitter.setMinorRouteUrl('');

		this.getPositions();
		this.getCountries();
		this.getFacilityTypes();
		this.getOwnerships();

		this.providerFormGroup = this._fb.group({
			providerName: ['', [<any>Validators.required]],
			address: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required]],
			contactName: ['', [<any>Validators.required]],
			contactNumber: ['', [<any>Validators.required]],
			contactPosition: ['', [<any>Validators.required]],
			contactEmail:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			type: ['', [<any>Validators.required]],
			lga: ['', [<any>Validators.required]],
			lasrraId: ['', [<any>Validators.required]],
			hefeemaNumber: ['', [<any>Validators.required]],
			hefeemaStatus: ['', [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required]],
			classification: ['', [<any>Validators.required]],
			grade: ['', [<any>Validators.required]],
			ownership: ['', [<any>Validators.required]],
			comment: ['', [<any>Validators.required]]
		});
	}

	onClickSaveProvider(value: any, valid: boolean) {
		//if(valid) {
			console.log(value);
			this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";

			let bankDetails = {
				name: this.providerFormGroup.controls['bankAccName'].value,
				accountNo: this.providerFormGroup.controls['bankAccNumber'].value,
			}

			let address = {
				street: this.providerFormGroup.controls['address'].value,
				lga: this.providerFormGroup.controls['lga'].value._id,
				state: this.stateId,
				country: this.countryId,
			}

			let careProvider = <CareProvider> {
		  		name: this.providerFormGroup.controls['providerName'].value,
				email: this.providerFormGroup.controls['contactEmail'].value,
				contactPhoneNo: this.providerFormGroup.controls['contactNumber'].value,
				contactFullName: this.providerFormGroup.controls['contactName'].value,
				facilityTypeId: this.providerFormGroup.controls['type'].value._id,
				lshmClassification: this.providerFormGroup.controls['classification'].value,
				bankDetails: bankDetails,
				address: address,
				isTokenVerified: false,
    			isLshma: true,
				//logo: this.providerFormGroup.controls['providerName'].value,
				//logoObject: this.providerFormGroup.controls['providerName'].value,
				lasrraId: this.providerFormGroup.controls['lasrraId'].value,
				hefeemaNo: this.providerFormGroup.controls['hefeemaNumber'].value,
				hefeemaStatus: this.providerFormGroup.controls['hefeemaStatus'].value,
				gradeId: this.providerFormGroup.controls['grade'].value,
				facilityOwnershipId: this.providerFormGroup.controls['ownership'].value._id
        	}

			console.log(careProvider);

			this._facilityService.create(careProvider).then(payload => {
				console.log(payload);
				this.providerFormGroup.reset();
				this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
				this._toastr.success('Care Provider has been created successfully!', 'Success!');
			}).catch(err => {
				console.log(err);
				if(err == "Error: This email already exist") {
					this._toastr.error('This email alreay exist!', 'Email exists!');
				} else {
					this._toastr.error('We could not save your data. Something went wrong!', 'Error!');
				}
			});

		// } else {
		// 	this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		// }
	}

	getPositions() {
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
	
	getFacilityTypes() {
		this._facilityTypeService.findAll().then((payload: any) => {
			this.facilityTypes = payload.data;
		});
	}
	
	getOwnerships() {
		this._ownershipService.findAll().then((payload: any) => {
			this.ownerships = payload.data;
		});
	}

}
