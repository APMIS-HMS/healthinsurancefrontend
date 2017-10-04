import { CoolLocalStorage } from 'angular2-cool-storage';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PlanService, PlanTypeService } from '../../../services/index';
import { Plan, PlanPremium } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DURATIONS } from '../../../services/globals/config';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { PremiumTypeService } from './../../../services/common/premium-type.service';

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
  premiumTypes: any[] = [];

  tab_details = true;
  tab_premium = false;
  tab_drugs = false;
  tab_tests = false;
  tab_procedures = false;
  tab_diagnosis = false;
  tab_confirm = false;

  constructor(private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _planService: PlanService,
    private _planTypeService: PlanTypeService,
    private _systemService: SystemModuleService,
    private _premiumTypeService: PremiumTypeService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.planDetailFormGroup = this._fb.group({
      planName: ['', [<any>Validators.required]],
      planType: ['', [<any>Validators.required]],
      planStatus: [true, [<any>Validators.required]]
    });

    this.planPremiumFormGroup = this._fb.group({
      planDuration: [1, [<any>Validators.required]],
      planAmount: [0, [<any>Validators.required]],
      planUnit: ['', [<any>Validators.required]],
      premiumCategory: [this.premiumTypes[0], [<any>Validators.required]]
    });

    this._getPlanTypes();
    this._getPremiumTypes();
    console.log(this._locker.getObject('auth'));
  }


  _getPremiumTypes() {
    this._premiumTypeService.find({}).then((payload: any) => {
      this.premiumTypes = payload.data;
      console.log(this.premiumTypes);
    }).catch(err => {
    });
  }
  private _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.findAll().then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        this.planTypes = res.data;
      }
    }).catch(err => {
      this._systemService.off();
    });
  }
  onClickPremiumNext() {
    console.log(this.plan);
    if (!this.plan.name) {
      this.disablePremiumNextBtn = true;
      this.premiumNextBtn = 'Saving Plan... <i class="fa fa-spinner fa-spin"></i>';
      // Save plan
      this._systemService.on();
      this._planService.create(this.plan).then(res => {
        this._systemService.off();
        this._toastr.success('Plan has been created successfully.', 'Success');
        this.premiumNextBtn = 'Save <i class="fa fa-check" aria-hidden="true"></i>';
        this.disablePremiumNextBtn = false;
        this.planDetailFormGroup.reset();
        this.planPremiumFormGroup.reset();
        this.planDetailFormGroup.controls['planStatus'].setValue(true);
        this.tabDetails_click();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      });
    } else {
      console.log('Plan Does not exist.');
    }
  }
  onClickAddPremium(valid: Boolean, value: any) {
    if (valid) {
      const premium = <PlanPremium>{
        category: value.premiumCategory,
        amount: value.planAmount,
        duration: value.planDuration,
        unit: value.planUnit.name,
        durationInDay: value.planUnit.days,
      };
      this.plan.premiums.push(premium);
      this.premiums.push(premium);
      console.log(this.premiums);
      this.planPremiumFormGroup.reset();
    } else {
      console.log('Not valid');
    }
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
      };
    } else {
      console.log('Not valid');
    }
  }

  tabPremium_click() {
    this.tab_details = false;
    this.tab_premium = true;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabDrugs_click() {
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = true;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabTests_click() {
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = true;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabProcedures_click() {
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = true;
    this.tab_diagnosis = false;
    this.tab_confirm = false;
  }
  tabDiagnosis_click() {
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = true;
    this.tab_confirm = false;
  }
  tabConfirm_click() {
    this.tab_details = false;
    this.tab_premium = false;
    this.tab_drugs = false;
    this.tab_tests = false;
    this.tab_procedures = false;
    this.tab_diagnosis = false;
    this.tab_confirm = true;
  }
}
