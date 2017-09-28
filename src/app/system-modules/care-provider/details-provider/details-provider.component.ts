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
		private _route: ActivatedRoute
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
		this._facilityService.get(this.routeId, {})
			.then(res => {
				this.providerDetails = res;
				console.log(this.providerDetails);
			});
	}
}
