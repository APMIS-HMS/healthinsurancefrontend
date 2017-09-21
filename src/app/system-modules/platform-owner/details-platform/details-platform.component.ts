import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-platform',
  templateUrl: './details-platform.component.html',
  styleUrls: ['./details-platform.component.scss']
})
export class DetailsPlatformComponent implements OnInit {

  showEmp = false;
  showProviders = false;
  showEmployers = false;
  showHias = true;

  platform= "LASHMA";

  constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Platform Details');
    	this._headerEventEmitter.setMinorRouteUrl('');	
  }
  
  hias_show(){
    this.showEmp = false;
    this.showEmployers = false;
    this.showHias = true;
    this.showProviders = false;
  }
  employees_show(){
    this.showEmp = true;
    this.showEmployers = false;
    this.showHias = false;
    this.showProviders = false;
  }
  employers_show(){
    this.showEmp = false;
    this.showEmployers = true;
    this.showHias = false;
    this.showProviders = false;
  }
  providers_show(){
    this.showEmp = false;
    this.showEmployers = false;
    this.showHias = false;
    this.showProviders = true;
  }

}
