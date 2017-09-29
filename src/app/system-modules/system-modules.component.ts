import { UploadService } from './../services/common/upload.service';
import { SystemModuleService } from './../services/common/system-module.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../services/event-emitters/header-event-emitter.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
	selector: 'app-system-modules',
	templateUrl: './system-modules.component.html',
	styleUrls: ['./system-modules.component.scss']
})
export class SystemModulesComponent implements OnInit {
	pageInView: String = '';
	minorPageInView: String = '';
	sideToggle: Boolean = false;
	sideMenuDropdown: Boolean = false;
	sideMenuId: String = '';
	online: boolean = false;
	baseRoute: any = '/modules/';
	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _authService: AuthService,
		private _router: Router,
		private loadingService: LoadingBarService,
		private _systemService: SystemModuleService,
		private _uploadService: UploadService,
	) {
		this.online = this._uploadService.checkOnlineStatus();
		console.log(this.online);
	}

	ngOnInit() {
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
				console.log(this.online);
			} else {
				this.loadingService.endLoading();
				this.online = false;
				console.log(this.online);
			}
		});
		this._headerEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
		this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
			this.minorPageInView = url;
		});
		this.online = this._uploadService.checkOnlineStatus();
		console.log(this.online);
	}

	onClickSideToggle() {
		this.sideToggle = !this.sideToggle;
	}

	loadRoutes(route: any) {
		console.log(route);
		this.loadingService.startLoading();
		this._router.navigate([this.baseRoute + route]).then(res => {
			this.loadingService.endLoading();
		}).catch(err => {
			console.log(err);
			this.loadingService.endLoading();
		});
	}

	onClickSideMenu(event, identifier) {
		this.sideMenuId = identifier;
		// let target = event.target || event.srcElement || event.currentTarget;
		// this.sideMenuId = target.className;
		// console.log(this.sideMenuId);
		// if (this.sideMenuDropdown && this.sideMenuId === identifier) {
		// 	this.sideMenuDropdown = !this.sideMenuDropdown;
		// } else {
		// 	this.sideMenuDropdown = !this.sideMenuDropdown;
		// }
	}

	signOut() {
		this._authService.checkAuth();
		this._router.navigate(['/auth']);
	}

}
