import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-system-modules',
  templateUrl: './system-modules.component.html',
  styleUrls: ['./system-modules.component.scss']
})
export class SystemModulesComponent implements OnInit {
	pageInView: string = "";
	minorPageInView: string = "";
	sideToggle: boolean = false;
	sideMenuDropdown: boolean = false;
	sideMenuId: string = "";

	constructor(
		private _headerEventEmitter: HeaderEventEmitterService
	) { }

	ngOnInit() {
		this._headerEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
		this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
			this.minorPageInView = url;
		});
	}

	onClickSideToggle() {
		this.sideToggle = !this.sideToggle;
	}
	
	onClickSideMenu(event, identifier) {
		var target = event.target || event.srcElement || event.currentTarget;
		this.sideMenuId = target.className;
		if(this.sideMenuDropdown && this.sideMenuId == identifier) {
			this.sideMenuDropdown = !this.sideMenuDropdown;
		} else {
			this.sideMenuDropdown = !this.sideMenuDropdown;
		}
	}

}
