import { SystemModuleService } from './../../../services/common/system-module.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from '../../../services/common/facility.service';

@Component({
	selector: 'app-details-provider',
	templateUrl: './details-provider.component.html',
	styleUrls: ['./details-provider.component.scss']
})
export class DetailsProviderComponent implements OnInit {
	routeId: string = "";
	providerDetails: any = {};
	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _facilityService: FacilityService,
		private _route: ActivatedRoute,
		private _systemService: SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Provider Details');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._route.params.subscribe(params => {
			console.log(params);
			this.routeId = params.id;
		});

		this._getProviderDetails();
	}
	_getProviderDetails() {
		this._systemService.on();
		this._facilityService.get(this.routeId, {})
			.then(res => {
				this._systemService.off();
				this.providerDetails = res;
			}).catch(err => {
				this._systemService.off();
			})
	}
}
