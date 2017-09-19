import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-beneficiary',
  templateUrl: './details-beneficiary.component.html',
  styleUrls: ['./details-beneficiary.component.scss']
})
export class DetailsBeneficiaryComponent implements OnInit {

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Beneficiary Details');
    	this._headerEventEmitter.setMinorRouteUrl('');	
	}

}
