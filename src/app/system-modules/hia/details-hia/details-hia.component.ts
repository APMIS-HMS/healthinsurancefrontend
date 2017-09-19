import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-hia',
  templateUrl: './details-hia.component.html',
  styleUrls: ['./details-hia.component.scss']
})
export class DetailsHiaComponent implements OnInit {

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('HIA Details');
		this._headerEventEmitter.setMinorRouteUrl('');
	}

}
