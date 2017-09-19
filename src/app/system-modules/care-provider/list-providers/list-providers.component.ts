import { Component, OnInit } from '@angular/core';
import { FacilitiesService } from '../../../services/api-services/index';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {
	providers: any = [];
	loading: boolean = false;

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _facilityService: FacilitiesService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Provider List');
		this._headerEventEmitter.setMinorRouteUrl('');

		this.getAllProviders();
	}

	getAllProviders() {
		this._facilityService.findAll().then(res => {
			console.log(res.data);
			if(res.data.length !== 0) {
				this.loading = false;
				/*
				*  Check if isLshma is true, that means that
				*  the data was added from this application
				*/
				res.data.forEach(element => {
					if(element.isLshma) {
						this.providers.push(element);
					}
				});
			} else {
				this.loading = false;
				this.providers = [];
			}
		});
	}

}
