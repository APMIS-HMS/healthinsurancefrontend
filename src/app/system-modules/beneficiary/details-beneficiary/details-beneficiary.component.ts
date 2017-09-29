import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-beneficiary',
  templateUrl: './details-beneficiary.component.html',
  styleUrls: ['./details-beneficiary.component.scss']
})
export class DetailsBeneficiaryComponent implements OnInit {

	tab_details = true;
	tab_referals = false;
	tab_complaints = false;
	tab_claims = false;
	tab_payment= false;

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Beneficiary Details');
    	this._headerEventEmitter.setMinorRouteUrl('');	
	}

	tabDetail_click(){
		this.tab_details = true;
		this.tab_referals = false;
		this.tab_complaints = false;
		this.tab_claims = false;
		this.tab_payment = false;
	}
	tabReferals_click(){
		this.tab_details = false;
		this.tab_referals = true;
		this.tab_complaints = false;
		this.tab_claims = false;
		this.tab_payment = false;
	}
	tabComplaints_click(){
		this.tab_details = false;
		this.tab_referals = false;
		this.tab_complaints = true;
		this.tab_claims = false;
		this.tab_payment = false;
	}
	tabClaims_click(){
		this.tab_details = false;
		this.tab_referals = false;
		this.tab_complaints = false;
		this.tab_claims = true;
		this.tab_payment = false;
	}
	tabPayment_click(){
		this.tab_details = false;
		this.tab_referals = false;
		this.tab_complaints = false;
		this.tab_claims = false;
		this.tab_payment = true;
	}

}
