import { SystemModuleService } from './../../../services/common/system-module.service';
import { UserTypeService } from './../../../services/common/user-type.service';
import { FacilityService } from './../../../services/common/facility.service';
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

	selectedUserType:any;

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _facilityService: FacilityService,
		private _userTypeService:UserTypeService,
		private _systemService:SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Employer Details');
		this._headerEventEmitter.setMinorRouteUrl('');

		this._getUserTypes();
	}

	_getUserTypes() {
		this._systemService.on();
		this._userTypeService.findAll().then((payload: any) => {
			this._systemService.off();
		  if (payload.data.length > 0) {
			const index = payload.data.findIndex(x => x.name === 'Employer');
			if (index > -1) {
			  this.selectedUserType = payload.data[index];
			  this._getEmployers();
			} else {
			  this.selectedUserType = undefined;
			}
		  }
		}, error => {
			this._systemService.off();
		})
	  }
	_getEmployers() {
		this.loading = true;
		this._systemService.on();
		this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id } }).then((res: any) => {
			this._systemService.off();
			if (res.data.length !== 0) {
				this.loading = false;
				this.employers = res.data;
			} else {
				this.loading = false;
				this.employers = [];
			}
		})
			.catch(err => {
				this._systemService.off();
			});
	}

}
