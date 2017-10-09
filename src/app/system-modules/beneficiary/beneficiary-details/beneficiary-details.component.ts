import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {

  listsearchControl = new FormControl();
	premiumsearchControl = new FormControl();

	tab_details = true;
  tab_payment = false;
  tab_claims = false;
	tab_complaints = false;
	tab_referals = false; 

	constructor() { }

  ngOnInit() { }
  
  tabDetails_click(){
    this.tab_details = true;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabPayment_click(){
    this.tab_details = false;
    this.tab_payment = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabClaims_click(){
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabComplaints_click(){
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_referals = false;
  }
  tabReferals_click(){
    this.tab_details = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = true;
  }

}
