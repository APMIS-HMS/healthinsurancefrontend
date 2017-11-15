import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { PolicyService } from './services/policy/policy.service';
import { NativeNotificationService } from 'angular-notice/lib/native-notification.service';

import { NotificationService } from './services/common/notification.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'app works!';
	constructor(
		public toastr: ToastsManager, vcr: ViewContainerRef,
		private _policyService: PolicyService,
		private _locker: CoolLocalStorage,
		private _nativeNotificationService: NativeNotificationService,
		private _notificationService: NotificationService) {
		this.toastr.setRootViewContainerRef(vcr);
	}

	ngOnInit() {
		var userUserType = (<any>this._locker.getObject('auth')).user;
		if (userUserType.userType != undefined) {
			this._policyService._listenerCreate.subscribe(payload => {
				// let title = "New Policy - " + payload.policyId;
				// let content = payload.principalBeneficiary.personId.firstName + " " + payload.principalBeneficiary.personId.firstName + " " + "added " + payload.dependantBeneficiaries.length + " dependant(s)";
				console.log("-----broadcast create object-------");
				this._notificationService.find({
					query: {
						'userType._id': userUserType.userType._id
					}
				}).then((noOfUnReads: any) => {
					let alert = noOfUnReads.data[noOfUnReads.data.length - 1];
					console.log(alert);
					const options = {
						title: alert.title,
						body: alert.body,
						dir: 'ltr',
						icon: './../assets/img/logos/lagos-state-logo.jpg',
						tag: 'notice',
						closeDelay: 7500
					};
					console.log(options);
					this._nativeNotificationService.notify(options);
				});
			});
		} else {
			this._policyService._listenerUpdate.subscribe(payload => {
				this._notificationService.find({
					query: {
						'userType._id': userUserType.userType._id
					}
				}).then((noOfUnReads: any) => {
					const options = {
						title: 'hello world',
						body: 'this is a notification body',
						dir: 'ltr',
						icon: './../assets/img/logos/lagos-state-logo.jpg',
						tag: 'notice',
						closeDelay: 2000
					};
					this._nativeNotificationService.notify(options);
				});

			});
		}
	}
}
