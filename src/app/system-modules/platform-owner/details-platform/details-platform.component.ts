import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-platform',
  templateUrl: './details-platform.component.html',
  styleUrls: ['./details-platform.component.scss']
})
export class DetailsPlatformComponent implements OnInit {

  constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Platform Details');
    	this._headerEventEmitter.setMinorRouteUrl('');	
	}

}
