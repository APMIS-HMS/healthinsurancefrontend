import { ActivatedRoute, Router } from '@angular/router';

import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit } from '@angular/core'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PlanService, PlanTypeService, FacilityService } from '../../../services/index';
import { Plan, PlanPremium } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DURATIONS } from '../../../services/globals/config';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { PremiumTypeService } from './../../../services/common/premium-type.service';
import { CurrentPlaformShortName } from '../../../services/globals/config'

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {

  planDetailFormGroup: FormGroup;
  planPremiumFormGroup: FormGroup;

  plan: Plan = <Plan>{};
  durations: any = DURATIONS;
  planTypes: any = <any>[];
  premiums: any = <any>[];
  saveBtn: String = 'SAVE <i class="fa fa-check" aria-hidden="true"></i>';
  premiumNextBtn: String = 'SAVE <i class="fa fa-check" aria-hidden="true"></i>';
  disablePremiumNextBtn: Boolean = false;
  premiumTypes: any[] = [];
  currentPlatform: any;
  user: any;
  selectedPlan: any;
  selectedPremium: any;

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
    private _facilityService: FacilityService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Plan');
    this._headerEventEmitter.setMinorRouteUrl('Create New Plan');
    this.user = this._locker.getObject('auth');
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

    this._getCurrentPlatform();
    this._getPlanTypes();
    this._getPremiumTypes();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.premiumNextBtn = 'UPDATE <i class="fa fa-check" aria-hidden="true"></i>';
        this._getPlan(param.id);
      }
    })
  }

  _getPlan(id) {
    this._systemService.on();
    this._planService.get(id, {}).then((payload: any) => {
      this.planDetailFormGroup.controls['planName'].setValue(payload.name);
      this.planDetailFormGroup.controls['planType'].setValue(payload.planType);
      this.premiums = payload.premiums;
      this.selectedPlan = payload;
      this.plan = payload;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._systemService.off();
      }
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }


  _getPremiumTypes() {
    this._systemService.on();
    this._premiumTypeService.find({}).then((payload: any) => {
      this.premiumTypes = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }
  private _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.find({}).then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        this.planTypes = res.data;
      }
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }
  onClickPremiumNext() {
    console.log(this.plan);
    if (this.plan.name) {
      this.disablePremiumNextBtn = true;
      this.premiumNextBtn = 'Saving Plan... <i class="fa fa-spinner fa-spin"></i>';

      this._systemService.on();
      if (this.selectedPlan === undefined) {
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
      }else{
        this._planService.update(this.selectedPlan).then(res => {
          this._systemService.off();
          this._toastr.success('Plan has been updated successfully.', 'Success');
          this.premiumNextBtn = 'Save <i class="fa fa-check" aria-hidden="true"></i>';
          this.disablePremiumNextBtn = false;
          this._router.navigate(['/modules/plan/plans']).then(payload =>{

          }).catch(err =>{

          });
          this.planDetailFormGroup.reset();
          this.planPremiumFormGroup.reset();
          this.planDetailFormGroup.controls['planStatus'].setValue(true);
          this.tabDetails_click();
        }).catch(err => {
          console.log(err);
          this._systemService.off();
        });
      }

    } else {
      console.log('Plan Does not exist.');
    }
  }
  onClickAddPremium(valid: Boolean, value: any) {
    if (valid) {
      console.log(value)
      if (this.selectedPremium === undefined) {
        console.log(1)
        const premium = <PlanPremium>{
          category: value.premiumCategory,
          amount: value.planAmount,
          duration: value.planDuration,
          unit: value.planUnit,
          durationInDay: value.planUnit.days,
        };
        console.log(this.selectedPlan)
        this.plan.premiums.push(premium);
        console.log(this.premiums);
        this.planPremiumFormGroup.reset();
      } else {
        console.log(2)
        this.selectedPremium.category = value.premiumCategory;
        this.selectedPremium.amount = value.planAmount;
        this.selectedPremium.duration = value.planDuration;
        this.selectedPremium.unit = value.planUnit;
        this.selectedPremium.durationInDay = value.planUnit.days;
        const index = this.selectedPlan.premiums.findIndex(x => x._id === this.selectedPremium._id);
        this.selectedPlan.premiums[index] = this.selectedPremium;
        this.selectedPremium = undefined;
        this.planPremiumFormGroup.reset();
      }

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
        platformOwnerId: this.currentPlatform,
        userType: this.user.user.userType,
        facilityId: this.user.user.facilityId,
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
  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }

  }
  compareDuration(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1.id === l2.id;
    }
  }
  getSelectedCategory(index, premiumType) {
    if (this.selectedPremium !== undefined && this.selectedPremium.category !== undefined) {
      return this.selectedPremium.category._id === premiumType._id;
    }

  }
  onSelectPlanRow(premium) {
    console.log(premium);
    this.selectedPremium = premium;
    this.planPremiumFormGroup.controls['premiumCategory'].setValue(premium.category);
    this.planPremiumFormGroup.controls['planAmount'].setValue(premium.amount);
    this.planPremiumFormGroup.controls['planDuration'].setValue(premium.duration);
    this.planPremiumFormGroup.controls['planUnit'].setValue(premium.unit);
  }
}
