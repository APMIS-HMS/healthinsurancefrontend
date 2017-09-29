import { SystemModuleService } from './../../../services/common/system-module.service';

import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from '../../../services/common/facility.service';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
	selector: 'app-list-providers',
	templateUrl: './list-providers.component.html',
	styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {
	providers: any = [];
	loading: boolean = false;
	selectedUserType: any;

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _facilityService: FacilityService,
		private _userTypeService: UserTypeService,
		private _systemService:SystemModuleService
	) { }

	ngOnInit() {
		this._headerEventEmitter.setRouteUrl('Provider List');
		this._headerEventEmitter.setMinorRouteUrl('');
		this._getUserTypes();
	}

	_getUserTypes() {
		this._systemService.on();
		this._userTypeService.findAll().then((payload: any) => {
			this._systemService.off();
			if (payload.data.length > 0) {
				const index = payload.data.findIndex(x => x.name === 'Provider');
				if (index > -1) {
					this.selectedUserType = payload.data[index];
					this._getAllProviders();
				} else {
					this.selectedUserType = undefined;
				}
			}
		}, error => {
			this._systemService.off();
		})
	}
	_getAllProviders() {
		this._systemService.on();
		this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id } }).then((res: any) => {
			this._systemService.off();
			if (res.data.length !== 0) {
				this.loading = false;
				this.providers = res.data;
			} else {
				this.loading = false;
				this.providers = [];
			}
		}).catch(err =>{
			this._systemService.off();
		})
	}

}
