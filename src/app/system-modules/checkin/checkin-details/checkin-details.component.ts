import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-details',
  templateUrl: './checkin-details.component.html',
  styleUrls: ['./checkin-details.component.scss']
})
export class CheckinDetailsComponent implements OnInit {

  tab_details = true;
  tab_claims = false;
	tab_complaints = false;
	tab_treatment = false;

  constructor() { }

  ngOnInit() {
  }

  tabDetails_click(){
    this.tab_details = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_treatment = false;
  }
  tabClaims_click(){
    this.tab_details = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_treatment = false;
  }
  tabComplaints_click(){
    this.tab_details = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_treatment = false;
  }
  tabTreatment_click(){
    this.tab_details = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_treatment = true;
  }

}
