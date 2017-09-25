import { Component, OnInit } from '@angular/core';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import {HiaService } from '../../../services/api-services/index';

@Component({
  selector: 'app-details-plan',
  templateUrl: './details-plan.component.html',
  styleUrls: ['./details-plan.component.scss']
})
export class DetailsPlanComponent implements OnInit {

  constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('HIA Details');
		this._headerEventEmitter.setMinorRouteUrl('');
	}

}
