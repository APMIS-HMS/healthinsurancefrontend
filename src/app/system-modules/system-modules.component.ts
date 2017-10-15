import { AuthService } from './../auth/services/auth.service';
import { HeaderEventEmitterService } from './../services/event-emitters/header-event-emitter.service';
import { UploadService } from './../services/common/upload.service';
import { SystemModuleService } from './../services/common/system-module.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
	selector: 'app-system-modules',
	templateUrl: './system-modules.component.html',
	styleUrls: ['./system-modules.component.scss']
})
export class SystemModulesComponent implements OnInit {
	user: any = <any>{};
	menuToggle = false;
	online = false;
	pageInView: String = '';
	minorPageInView: String = '';

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _authService: AuthService,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private loadingService: LoadingBarService,
		private _systemService: SystemModuleService,
		private _uploadService: UploadService,
	) {
		this.online = this._uploadService.checkOnlineStatus();
	}

	ngOnInit() {
		this.user = (<any> this._locker.getObject('auth')).user;
		console.log(this.user);
		this._systemService.announceLoggedInUser(this.user);

		this._systemService.notificationAnnounced$.subscribe((value: any) => {
			if (value.status === 'On') {
				this.loadingService.startLoading();
			} else {
				this.loadingService.endLoading();
			}
		});
		this._systemService.broadCastOnlineSource$.subscribe((value: any) => {
			if (value.status === 'On') {
				this.online = true;
			} else {
				this.loadingService.endLoading();
				this.online = false;
			}
		});
		this._headerEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
		this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
			this.minorPageInView = url;
		});
		this.online = this._uploadService.checkOnlineStatus();
	}

	close_onClick(message: boolean) {
		this.menuToggle = false;
	}
	menu_onClick(message: boolean) {
		this.menuToggle = true;
	}

}
