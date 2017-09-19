import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	tabActive: boolean = false;
	tabId: string = '';

	constructor(private _router: Router) { }

	ngOnInit() {
		let page: string = this._router.url;
		this.checkPageUrl(page);
	}

	onClickTab(tab) {
		this.tabActive = true;

		if(tab === "login") {
			this.tabId = 'login';
		} else if(tab === "register") {
			this.tabId = 'register';
		}
	}
	private checkPageUrl(param: string) {
		this.tabActive = true;
		if(param.includes('login')) {
			this.tabId = 'login';
		} else {
			this.tabId = 'register';
		}
	}
}
