import { Component, OnInit } from '@angular/core';
import {HiaService } from '../../../services/api-services/index';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-hias',
  templateUrl: './list-hias.component.html',
  styleUrls: ['./list-hias.component.scss']
})
export class ListHiasComponent implements OnInit {
	hias: any = [];

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _hiaService: HiaService,
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('HIA List');
    	this._headerEventEmitter.setMinorRouteUrl('');

		this.getAllHias();
	}

	getAllHias() {
		this._hiaService.findAll().then(payload => {
			console.log(payload);
			this.hias = payload.data;
		});
	}

}
