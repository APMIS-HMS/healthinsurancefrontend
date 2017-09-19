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
		private _employerService: CorporateFacilityService,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Employer Details');
    	this._headerEventEmitter.setMinorRouteUrl('');

		this._route.params.subscribe( params => {
			console.log(params);
			this.routeId = params.id;
		});

		this.getEmployerDetails();
	}

	getEmployerDetails() {
		this._employerService.get(this.routeId, {})
			.then(res => {
				this.employerDetails = res;
				console.log(this.employerDetails);
			});
	}

}
