import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {

  planDetailFormGroup: FormGroup;
  planPremiumFormGroup: FormGroup;

  tab_details = true;
  tab_premium = false;
  tab_drugs = false;
  tab_tests = false;
  tab_procedures = false;
  tab_diagnosis = false;
  tab_confirm = false;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
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

  onClickAddPlan(){
    this.tab_details = false;
    this.tab_premium = true;
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
