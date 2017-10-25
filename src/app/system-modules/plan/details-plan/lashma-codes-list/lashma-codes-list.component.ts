import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lashma-codes-list',
  templateUrl: './lashma-codes-list.component.html',
  styleUrls: ['./lashma-codes-list.component.scss']
})
export class LashmaCodesListComponent implements OnInit {

  tab_drug = true;
  tab_investigation = false;
  tab_procedure = false;
  tab_visit = false;

  constructor() { }

  ngOnInit() {
  }

  tabDrug_click(){
    this.tab_drug = true;
    this.tab_investigation = false;
    this.tab_procedure = false;
    this.tab_visit = false;
  }
  tabInvestigation_click(){
    this.tab_drug = false;
    this.tab_investigation = true;
    this.tab_procedure = false;
    this.tab_visit = false;
  }
  tabProcedure_click(){
    this.tab_drug = false;
    this.tab_investigation = false;
    this.tab_procedure = true;
    this.tab_visit = false;
  }
  tabVisit_click(){
    this.tab_drug = false;
    this.tab_investigation = false;
    this.tab_procedure = false;
    this.tab_visit = true;
  }
}
