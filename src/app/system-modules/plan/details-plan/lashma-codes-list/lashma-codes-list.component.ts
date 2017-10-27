import { Component, OnInit } from '@angular/core';
import { SystemModuleService } from '../../../../services/common/system-module.service';
import { DrugService, ProcedureService, InvestigationService, VisitTypeService } from '../../../../services/index';

@Component({
  selector: 'app-lashma-codes-list',
  templateUrl: './lashma-codes-list.component.html',
  styleUrls: ['./lashma-codes-list.component.scss']
})
export class LashmaCodesListComponent implements OnInit {
  drugs: any = [];
  procedures: any = [];
  investigations: any = [];
  visitTypes: any = [];
  tab_drug = true;
  tab_investigation = false;
  tab_procedure = false;
  tab_visit = false;

  constructor(
    private _systemService: SystemModuleService,
    private _drugService: DrugService,
    private _investigationService: InvestigationService,
    private _procedureService: ProcedureService,
    private _visitTypeService: VisitTypeService
  ) { }

  ngOnInit() {
    this._getDrugs();
  }

  private _getDrugs() {
    this._systemService.on();
    this._drugService.find({}).then((res: any) => {
      console.log(res);
      this.drugs = res;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  tabDrug_click() {
    this.tab_drug = true;
    this.tab_investigation = false;
    this.tab_procedure = false;
    this.tab_visit = false;
  }
  tabInvestigation_click() {
    this.tab_drug = false;
    this.tab_investigation = true;
    this.tab_procedure = false;
    this.tab_visit = false;
  }
  tabProcedure_click() {
    this.tab_drug = false;
    this.tab_investigation = false;
    this.tab_procedure = true;
    this.tab_visit = false;
  }
  tabVisit_click() {
    this.tab_drug = false;
    this.tab_investigation = false;
    this.tab_procedure = false;
    this.tab_visit = true;
  }
}
