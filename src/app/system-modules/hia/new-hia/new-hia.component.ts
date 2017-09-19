import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilityTypesService, FacilitiesService, GenderService, PersonService, TitleService, UserService, 
  MaritalStatusService, HiaService, HiaNameService, HiaProgramService, HiaPlanService, HiaPositionService } from '../../../services/api-services/index';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary , Hia} from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-hia',
  templateUrl: './new-hia.component.html',
  styleUrls: ['./new-hia.component.scss']
})
export class NewHiaComponent implements OnInit {
	hiaFormGroup: FormGroup;
	hiaTypes: any = [];
	hiaPlans: any = [];
	hiaPositions: any = [];
	plans: any = [];
	saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";

	constructor(
		private _fb: FormBuilder,
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _hiaService: HiaService,
		private _hiaProgramService: HiaProgramService,
		private _hiaPlanService: HiaPlanService,
		private _hiaPositionService: HiaPositionService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New HIA');
		this._headerEventEmitter.setMinorRouteUrl('');

		this.getHiaProgramType();
		this.getHiaPlans();
		this.getHiaPositions();

		this.hiaFormGroup = this._fb.group({
			employerName: ['', [<any>Validators.required]],
			address: ['', [<any>Validators.required]],
			neighbourhood: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required]],
			businessContactName: ['', [<any>Validators.required]],
			businessContactNumber: ['', [<any>Validators.required]],
			businessContactPosition: ['', [<any>Validators.required]],
			businessContactEmail:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			iTContactName: ['', [<any>Validators.required]],
			iTContactNumber: ['', [<any>Validators.required]],
			iTContactPosition: ['', [<any>Validators.required]],
			iTContactEmail:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			type: ['', [<any>Validators.required]],
			bankAccName: ['', [<any>Validators.required]],
			bankAccNumber: ['', [<any>Validators.required]],
			plan: ['', [<any>Validators.required]],
			// plan2: ['', [<any>Validators.required]],
			// plan3: ['', [<any>Validators.required]],
			nhisNumber: ['', [<any>Validators.required]],
			cinNumber: ['', [<any>Validators.required]],
			registrationDate: ['', [<any>Validators.required]]
		});
	}

	onClickSaveHia(value: any, valid: boolean) {
		if(valid) {
			this.saveBtn = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";
			
			let businessContact = {
				name: this.hiaFormGroup.controls['businessContactName'].value,
				phone: this.hiaFormGroup.controls['businessContactNumber'].value,
				positionId: this.hiaFormGroup.controls['businessContactPosition'].value._id,
				email: this.hiaFormGroup.controls['businessContactEmail'].value,
			}

			let iTContact = {
				name: this.hiaFormGroup.controls['iTContactName'].value,
				phone: this.hiaFormGroup.controls['iTContactNumber'].value,
				positionId: this.hiaFormGroup.controls['iTContactPosition'].value._id,
				email:  this.hiaFormGroup.controls['iTContactEmail'].value,
			}
			let bankDetails = {
				name: this.hiaFormGroup.controls['bankAccName'].value,
				accountNo: this.hiaFormGroup.controls['bankAccNumber'].value,
			}

			let plan = {
				planId: this.hiaFormGroup.controls['plan'].value._id
			};
			this.plans.push(plan);

			let hia = <Hia> {
		  		employerName: this.hiaFormGroup.controls['employerName'].value,
				address: this.hiaFormGroup.controls['address'].value,
				neighbourhood: this.hiaFormGroup.controls['neighbourhood'].value,
				phoneNumber: this.hiaFormGroup.controls['phone'].value,
				businessContact: businessContact,
				itContact: iTContact,
				hiaTypeId: this.hiaFormGroup.controls['type'].value._id,
				bankDetails: bankDetails,
				hiaPlanIds: this.plans,
				nhisNo: this.hiaFormGroup.controls['nhisNumber'].value,
				cinNo: this.hiaFormGroup.controls['cinNumber'].value,
				registrationDate: this.hiaFormGroup.controls['registrationDate'].value
        	}

			this._hiaService.create(hia).then(payload => {
				this.hiaFormGroup.reset();
				this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
				this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
			}).catch(err => {
				console.log(err);
			});

		} else {
			this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
		}
	}

	getHiaProgramType() {
		this._hiaProgramService.findAll().then((payload: any) => {
			this.hiaTypes = payload.data;
		});
	}
	
	getHiaPlans() {
		this._hiaPlanService.findAll().then((payload: any) => {
			this.hiaPlans = payload.data;
		});
	}
	
	getHiaPositions() {
		this._hiaPositionService.findAll().then((payload: any) => {
			this.hiaPositions = payload.data;
		});
	}
}
