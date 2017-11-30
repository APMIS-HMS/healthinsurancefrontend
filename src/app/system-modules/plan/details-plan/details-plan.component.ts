import { CoolLocalStorage } from 'angular2-cool-storage';
import { PremiumTypeService } from './../../../services/common/premium-type.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { PlanTypeService } from './../../../services/common/plan-type.service';
import { PlanService } from './../../../services/plan/plan.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilityService } from '../../../services/index';

@Component({
	selector: 'app-details-plan',
	templateUrl: './details-plan.component.html',
	styleUrls: ['./details-plan.component.scss']
})
export class DetailsPlanComponent implements OnInit {
	listsearchControl = new FormControl();
	premiumsearchControl = new FormControl();

	tab_hias = true;
	tab_drugs = false;
	tab_tests = false;
	tab_procedures = false;
	tab_diagnosis = false;
	tab_detail = false;

	selectedPlan: any;

	constructor(
		private _toastr: ToastsManager,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _planService: PlanService,
		private _planTypeService: PlanTypeService,
		private _systemService: SystemModuleService,
		private _premiumTypeService: PremiumTypeService,
		private _facilityService: FacilityService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Plan Details');
		this._headerEventEmitter.setMinorRouteUrl('View Plan Details');
		this._route.params.subscribe(param => {
			if (param.id !== undefined) {
				this._getPlan(param.id);
			}
		})
	 }

	_getPlan(id) {
		this._systemService.on();
		this._planService.get(id, {}).then((payload: any) => {
			this.selectedPlan = payload;
			console.log(this.selectedPlan);
			this._systemService.off();
		}).catch(err => {
			this._systemService.off();
		});
	}

	navigateEditPlan(plan) {
		this._systemService.on();
		this._router.navigate(['/modules/plan/new', plan._id]).then(res => {
		  this._systemService.off();
		}).catch(err => {
		  console.log(err);
		  this._systemService.off();
		});
	  }

	navigateNewPlan() {
		this._systemService.on();
		this._router.navigate(['/modules/plan/new']).then(res => {
			this._systemService.off();
		}).catch(err => {
			this._systemService.off();
		});
	}
	navigate(url) {
		this._systemService.on();
		this._router.navigate([url]).then(res => {
			this._systemService.off();
		}).catch(err => {
			this._systemService.off();
		});
	}

	tabHia_click() {
		this.tab_hias = true;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
		this.tab_detail = false;
	}

	tabDrugs_click() {
		this.tab_hias = false;
		this.tab_drugs = true;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
		this.tab_detail = false;
	}
	tabTests_click() {
		this.tab_hias = false;
		this.tab_drugs = false;
		this.tab_tests = true;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
		this.tab_detail = false;
	}
	tabProcedures_click() {
		this.tab_hias = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = true;
		this.tab_diagnosis = false;
		this.tab_detail = false;
	}
	tabDiagnosis_click() {
		this.tab_hias = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = true;
		this.tab_detail = false;
	}
	tabDetail_click() {
		this.tab_hias = false;
		this.tab_drugs = false;
		this.tab_tests = false;
		this.tab_procedures = false;
		this.tab_diagnosis = false;
		this.tab_detail = true;
	}

}
