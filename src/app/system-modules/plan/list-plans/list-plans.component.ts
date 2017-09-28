import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PlanService } from '../../../services/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-plans',
  templateUrl: './list-plans.component.html',
  styleUrls: ['./list-plans.component.scss']
})
export class ListPlansComponent implements OnInit {
	plans: any = <any>[];
	loading: Boolean = true;


  constructor(
		private _toastr: ToastsManager,
		private _planService: PlanService,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _systemService:SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Plan List');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._getPlans();
	}

	onClickActivate(plan: any) {
		plan.isActive = plan.isActive ? false : true;

		this._planService.update(plan).then((res: any) => {
			this._getPlans();
			const isActive = plan.isActive ? 'activated' : 'deactivated';
			const text = plan.name + ' has been ' + isActive + ' successfully!';
			this._toastr.success(text, 'Success!');
		}).catch(err => this._toastr.error('There was a problem updating plan. Please try again later!', 'Error!'));
	}

	private _getPlans() {
		this._systemService.on();
		this._planService.findAll().then((res: any) => {
			this._systemService.off();
			this.loading = false;
			console.log(res);
			if (res.data.length > 0) {
				this.plans = res.data;
			}
		}).catch(err => {
			this._systemService.off();
		});
	}
}
