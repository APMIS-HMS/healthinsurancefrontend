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

  planDetailFormGroup: FormGroup;
  planPremiumFormGroup: FormGroup;

	positions: any = [];
	lgas: any = [];
	countryId: string = "";
	stateId: string = "";
	facilityTypes: any = [];
	grades: any = GRADES;
	ownerships: any = [];
	HEFAMAA_STATUSES: any = HEFAMAA_STATUSES;
  saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
  
  tab_details = true;
  tab_premium = false;
  tab_drugs = false;
  tab_tests = false;
  tab_procedures = false;
  tab_diagnosis = false;
  tab_confirm = false;

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

		this.planDetailFormGroup = this._fb.group({
			planName: ['', [<any>Validators.required]],
			planType: ['', [<any>Validators.required]],
			planCreatedBy: ['', [<any>Validators.required]],
			planStatus: ['', [<any>Validators.required]]
    });
    
    this.planPremiumFormGroup = this._fb.group({
			planDuration: ['', [<any>Validators.required]],
			planAmount: ['', [<any>Validators.required]],
			planUnit: ['', [<any>Validators.required]]
    });
  }
  
  tabDetails_click(){
    this.tab_details = true;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabPremium_click(){
    this.tab_details = false;
    this.tab_premium = true;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabDrugs_click(){
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = true;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabTests_click(){
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = true;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabProcedures_click(){
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = true;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabDiagnosis_click(){
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = true;
    this.tab_confirm = false;
  }
  tabConfirm_click(){
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = true;
  }
}
