import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { SystemModuleService } from '../../services/common/system-module.service';
import { DrugService, ProcedureService, InvestigationService, VisitTypeService } from '../../services/index';

@Component({
  selector: 'app-lashma-codes',
  templateUrl: './lashma-codes.component.html',
  styleUrls: ['./lashma-codes.component.scss']
})
export class LashmaCodesComponent implements OnInit {
  drugs: any = [];
  procedures: any = [];
  investigations: any = [];
  visitTypes: any = [];
  tab_drug = true;
  tab_investigation = false;
  tab_procedure = false;
  tab_visit = false;
  drugLoading = true;
  procedureLoading = true;
  investigationLoading = true;
  visitTypeLoading = true;
  customClass: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _systemService: SystemModuleService,
    private _drugService: DrugService,
    private _investigationService: InvestigationService,
    private _procedureService: ProcedureService,
    private _visitTypeService: VisitTypeService
  ) { }

  ngOnInit() {
    this._getDrugs();
    this._getProcedures();
    this._getInvestigations();
    this._getVisitTypes();

    if (this._router.url.includes('plan')) {
      this.customClass = false;
    } else {
      this.customClass = true;
    }
  }

  private _getDrugs() {
    this._systemService.on();
    this._drugService.find({}).then((res: any) => {
      console.log(res);
      this.drugLoading = false;
      this.drugs = res.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getProcedures() {
    this._systemService.on();
    this._procedureService.find({}).then((res: any) => {
      console.log(res);
      this.procedureLoading = false;
      this.procedures = res.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getInvestigations() {
    this._systemService.on();
    this._investigationService.find({}).then((res: any) => {
      console.log(res);
      this.investigationLoading = false;
      this.investigations = res.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getVisitTypes() {
    this._systemService.on();
    this._visitTypeService.find({}).then((res: any) => {
      console.log(res);
      this.visitTypeLoading = false;
      this.visitTypes = res.data;
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
