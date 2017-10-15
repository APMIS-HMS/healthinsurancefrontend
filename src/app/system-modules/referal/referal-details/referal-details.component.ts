import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referal-details',
  templateUrl: './referal-details.component.html',
  styleUrls: ['./referal-details.component.scss']
})
export class ReferalDetailsComponent implements OnInit {

  tab_details = true;
  tab_claims = false;
  tab_complaints = false;

  constructor() { }

  ngOnInit() {
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_claims = false;
    this.tab_complaints = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_claims = true;
    this.tab_complaints = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_claims = false;
    this.tab_complaints = true;
  }

}
