import { SystemModuleService } from './../../../services/common/system-module.service';
import { FacilityService } from './../../../services/common/facility.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CorporateFacilityService } from '../../../services/api-services/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-employer',
  templateUrl: './details-employer.component.html',
  styleUrls: ['./details-employer.component.scss']
})
export class DetailsEmployerComponent implements OnInit {
	routeId: string = "";
	employerDetails: any = {};
	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _facilityService: FacilityService,
		private _route: ActivatedRoute,
		private _systemService:SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Employer Details');
    	this._headerEventEmitter.setMinorRouteUrl('');

		this._route.params.subscribe( params => {
			this.routeId = params.id;
			this._getEmployerDetails();
		});
	}

	_getEmployerDetails() {
		this._systemService.on();
		this._facilityService.get(this.routeId, {})
			.then(res => {
				this.employerDetails = res;
				this._systemService.off();
			}).catch(err =>{
				this._systemService.off();
			})
	}

}
