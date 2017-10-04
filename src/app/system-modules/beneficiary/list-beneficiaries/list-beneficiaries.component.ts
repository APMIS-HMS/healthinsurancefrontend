import { UserTypeService } from './../../../services/common/user-type.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
// import * from '../../../rxjs/rxjs.extentions';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-list-beneficiaries',
  templateUrl: './list-beneficiaries.component.html',
  styleUrls: ['./list-beneficiaries.component.scss']
})
export class ListBeneficiariesComponent implements OnInit {
	previousUrl: string = '';

	constructor(
		private _router: Router,
		private _headerEventEmitter: HeaderEventEmitterService,
		private _userTypeService: UserTypeService
	) {
		this._router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe(e => {
			});
	 }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Beneficiary List');
		this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');
		this._userTypeService.findAll()
		.then(payload =>{
			console.log(payload)
		})
	}

}
