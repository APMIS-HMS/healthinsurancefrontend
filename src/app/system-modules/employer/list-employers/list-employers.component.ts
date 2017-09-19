import { Component, OnInit } from '@angular/core';
import { CorporateFacilityService } from '../../../services/api-services/index';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-employers',
  templateUrl: './list-employers.component.html',
  styleUrls: ['./list-employers.component.scss']
})
export class ListEmployersComponent implements OnInit {
	employers: any = [];
	loading: boolean = false;

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _employerService: CorporateFacilityService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Employer Details');
		this._headerEventEmitter.setMinorRouteUrl('');

		this.getAllEmployers();
	}

	getAllEmployers() {
		this.loading = true;
		this._employerService.findAll().then(res => {
			console.log(res);
			if(res.data.length !== 0) {
				this.loading = false;
				/*
				*  Check if isLshma is true, that means that
				*  the data was added from this application
				*/
				res.data.forEach(element => {
					if(element.isLshma) {
						this.employers.push(element);
					}
				});
			} else {
				this.loading = false;
				this.employers = [];
			}
		})
		.catch(err => {
			console.log(err);
		});
	}

}
