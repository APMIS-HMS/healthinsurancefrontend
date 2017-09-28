import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { HiaService } from '../../../services/api-services/index';

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
		private _systemService: SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('HIA List');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._getAllHias();
	}

	_getAllHias() {
		this._systemService.on();
		this._hiaService.findAll().then(payload => {
			this._systemService.off();
			this.hias = payload.data;
		}).catch(err => {
			this._systemService.off();
		})
	}

}
