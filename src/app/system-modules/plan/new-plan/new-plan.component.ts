import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PlanService, PlanTypeService } from '../../../services/index';
import { Plan, PlanPremium } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DURATIONS } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {
  planDetailFormGroup: FormGroup;
  planPremiumFormGroup: FormGroup;
  plan: Plan = <Plan>{};
  planOwner: String = '';
  durations: any = DURATIONS;
  planTypes: any = <any>[];
  premiums: any = <any>[];
  saveBtn: String = 'SAVE <i class="fa fa-check" aria-hidden="true"></i>';
  premiumNextBtn: String = 'SAVE <i class="fa fa-check" aria-hidden="true"></i>';
  disablePremiumNextBtn: Boolean = false;
  
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
    private _headerEventEmitter: HeaderEventEmitterService,
    private _planService: PlanService,
    private _planTypeService: PlanTypeService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('New Plan');
    this._headerEventEmitter.setMinorRouteUrl('');

    this._getPlanTypes();

    this.planOwner = "LASHMA";

		this.planDetailFormGroup = this._fb.group({
			planName: ['', [<any>Validators.required]],
			planType: ['', [<any>Validators.required]],
			planStatus: [true, [<any>Validators.required]]
    });
    
    this.planPremiumFormGroup = this._fb.group({
			planDuration: [1, [<any>Validators.required]],
			planAmount: [0, [<any>Validators.required]],
			planUnit: ['', [<any>Validators.required]]
    });
  }

  onClickAddPlan(valid: Boolean, value: any) {
    if (valid) {
      this.tab_details = false;
      this.tab_premium = true;
      this.tab_drugs = false;
      this.tab_tests = false;
      this.tab_procedures = false;
      this.tab_diagnosis = false;
      this.tab_confirm = false;

      this.plan = <Plan>{
        name: value.planName,
        planType: value.planType,
        planOwner: this.planOwner,
        isActive: value.planStatus,
        premiums: []
      }
    } else {
      console.log('Not valid');
    }
  }
  
  
  onClickAddPremium(valid: Boolean, value: any) {
    if (valid) {
      const premium = <PlanPremium> {
        amount: value.planAmount,
        duration: value.planDuration,
        unit: value.planUnit.name,
        durationInDay: value.planUnit.days
      };
      this.plan.premiums.push(premium);
      this.premiums.push(premium);
    } else {
      console.log('Not valid');
    }
  }

  onClickPremiumNext() {
    if (!!this.plan.name) {
      this.disablePremiumNextBtn = true;
      this.premiumNextBtn = 'Saving Plan... <i class="fa fa-spinner fa-spin"></i>';
      // Save plan
      this._planService.create(this.plan).then(res => {
        console.log(res);
        this._toastr.success('Plan has been created successfully.', 'Success');
        this.premiumNextBtn = 'Save <i class="fa fa-check" aria-hidden="true"></i>';
        this.disablePremiumNextBtn = false;
        this.planDetailFormGroup.reset();
        this.planPremiumFormGroup.reset();
        this.planDetailFormGroup.controls['planStatus'].setValue(true);
        this.tabDetails_click();
      }).catch(err => console.log(err));
    } else {
      console.log('Plan Does not exist.');
    }
  }

  private _getPlanTypes() {
    this._planTypeService.findAll().then((res: any) => {
      if (res.data.length > 0) {
        this.planTypes = res.data;
      }
    }).catch(err => console.log(err));
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

  tabDetails_click(){
    this.tab_details = true;
    this.tab_premium = false;
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
