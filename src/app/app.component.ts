import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NotificationsService } from 'angular2-notifications';
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
		private _notificationsService: NotificationsService,
		private _policyService: PolicyService) {
		this.toastr.setRootViewContainerRef(vcr);

	}

	ngOnInit() {
		this._policyService._listenerCreate.subscribe(payload => {
			
		});
		this._policyService._listenerUpdate.subscribe(payload => {
			
		});
	}
}
