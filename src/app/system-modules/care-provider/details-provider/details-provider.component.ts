import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-provider',
  templateUrl: './details-provider.component.html',
  styleUrls: ['./details-provider.component.scss']
})
export class DetailsProviderComponent implements OnInit {

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Provider Details');
    	this._headerEventEmitter.setMinorRouteUrl('');
	}

}
