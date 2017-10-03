import { UploadService } from './../services/common/upload.service';
import { SystemModuleService } from './../services/common/system-module.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
	selector: 'app-system-modules',
	templateUrl: './system-modules.component.html',
	styleUrls: ['./system-modules.component.scss']
})
export class SystemModulesComponent implements OnInit {

	menuToggle = false;
	
	constructor() {
	}

	ngOnInit() {
	}

	close_onClick(message: boolean){
		this.menuToggle = false;
	}
	menu_onClick(message: boolean){
		this.menuToggle = true;
	}

}
