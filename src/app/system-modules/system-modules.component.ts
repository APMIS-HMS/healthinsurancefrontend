import { RoleService } from './../services/auth/role/role.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../auth/services/auth.service';
import { HeaderEventEmitterService } from './../services/event-emitters/header-event-emitter.service';
import { UploadService } from './../services/common/upload.service';
import { SystemModuleService } from './../services/common/system-module.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PolicyService } from './../services/policy/policy.service';

import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
	selector: 'app-system-modules',
	templateUrl: './system-modules.component.html',
	styleUrls: ['./system-modules.component.scss']
})
export class SystemModulesComponent implements OnInit, OnDestroy {
	ngOnDestroy(): void {
		// this.sub.unsubscribe();
	}
	user: any = <any>{};
	menuToggle = false;
	online = false;
	pageInView: String = '';
	minorPageInView: String = '';

	sub: Subscription;
	constructor(
		private _headerEventEmitter: HeaderEventEmitterService,
		private _authService: AuthService,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private loadingService: LoadingBarService,
		private _systemService: SystemModuleService,
		private _roleService: RoleService,
		private _uploadService: UploadService,
		private _policyService:PolicyService
	) {
		this.online = this._uploadService.checkOnlineStatus();
	}

	ngOnInit() {
		try {
			this.user = (<any>this._locker.getObject('auth')).user;
			this._systemService.announceLoggedInUser(this.user);

			this._systemService.notificationAnnounced$.subscribe((value: any) => {
				if (value.status === 'On') {
					this.loadingService.start();
				} else {
					this.loadingService.complete();
				}
			});
			this._systemService.broadCastOnlineSource$.subscribe((value: any) => {
				if (value.status === 'On') {
					this.online = true;
				} else {
					this._systemService.off();
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
		} catch (error) {
			// this._router.navigate(['auth/login']);
		}
		// this._checkRole();
		this._policyService._listenerCreate.subscribe(payload => {
			console.log(" broadcasting------from ----system module---");
		});

		this._policyService._listenerUpdate.subscribe(payload => {
		
		});
	}
	private _checkRole() {
		try {
			const roles = this.user.roles;
			console.log
			const roleIds: any[] = [];
			roles.forEach(x => {
				roleIds.push(x._id);
			})

			this._roleService.find({
				query: {
					_id: {
						$in: roleIds
					}
				}
			}).then((pays: any) => {
				pays.data.forEach(roleItem => {
					if (!!roleItem.accessibilities) {
						const accessibilities = roleItem.accessibilities;
						this._locker.setObject('accessibilities', accessibilities);
					}
				});
			}).catch(err => {

			})
		} catch (error) {

		}
	}
	close_onClick(message: boolean) {
		this.menuToggle = false;
	}
	menu_onClick(message: boolean) {
		this.menuToggle = true;
	}

}
