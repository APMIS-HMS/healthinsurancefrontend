import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-details-plan',
  templateUrl: './details-plan.component.html',
  styleUrls: ['./details-plan.component.scss']
})
export class DetailsPlanComponent implements OnInit {

  listsearchControl = new FormControl();  
  premiumsearchControl = new FormControl(); 
  
  tab_hias = true;
	tab_premiums = false;
	tab_drugs = false;
	tab_tests = false;
	tab_procedures = false;
	tab_diagnosis = false;

  constructor() { }

	ngOnInit() {}

	tabHia_click(){
		this.tab_hias = true;
		this.tab_premiums = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
	}
	tabPremiums_click(){
		this.tab_hias = false;
		this.tab_premiums = true;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
	}
	tabDrugs_click(){
		this.tab_hias = false;
		this.tab_premiums = false;
		this.tab_drugs = true;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
	}
	tabTests_click(){
		this.tab_hias = false;
		this.tab_premiums = false;
		this.tab_drugs = false;
		this.tab_tests = true;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
	}
	tabProcedures_click(){
		this.tab_hias = false;
		this.tab_premiums = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = true;
		this.tab_diagnosis = false;
	}
	tabDiagnosis_click(){
		this.tab_hias = false;
		this.tab_premiums = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = true;
	}

}
