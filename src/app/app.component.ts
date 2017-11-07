import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
//import { NotificationsService,NotificationComponent} from 'angular2-notifications';

import { PolicyService } from './services/policy/policy.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'app works!';
	constructor(
		public toastr: ToastsManager,
		vcr: ViewContainerRef,
		//private _notificationsService: NotificationsService,
		private _policyService: PolicyService) {
		this.toastr.setRootViewContainerRef(vcr);

	}

	ngOnInit() {
		this._policyService._listenerCreate.subscribe(payload => {
			let title= "New Policy - "+payload.policyId;
			let content = payload.principalBeneficiary.personId.firstName + " "+ payload.principalBeneficiary.personId.firstName + " "+ "added "+ payload.dependantBeneficiaries.length + " dependant(s)";
			//this._notificationsService.alert(title,content,{});
			console.log(content + " broadcasting");
		});

		this._policyService._listenerUpdate.subscribe(payload => {
			let title= "Policy updated - "+payload.policyId;
			let content = payload.principalBeneficiary.personId.firstName + " "+ payload.principalBeneficiary.personId.firstName + " "+ "added "+ payload.dependantBeneficiaries.length + " dependant(s)";
			
		});
	}
}
