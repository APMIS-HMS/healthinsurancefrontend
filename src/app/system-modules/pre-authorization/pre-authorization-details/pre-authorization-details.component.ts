import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-authorization-details',
  templateUrl: './pre-authorization-details.component.html',
  styleUrls: ['./pre-authorization-details.component.scss']
})
export class PreAuthorizationDetailsComponent implements OnInit {
  
  tab_details = true;
  tab_other = false;
  tab_complaints = false;
  tab_referals = false;
  
  constructor() { }

  ngOnInit() {
  }
  tabDetails_click() {
    this.tab_details = true;
    this.tab_other = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabOther_click() {
    this.tab_details = false;
    this.tab_other = true;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_complaints = true;
    this.tab_referals = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_complaints = false;
    this.tab_referals = true;
  }
}
