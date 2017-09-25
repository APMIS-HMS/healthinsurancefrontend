import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	tabActive: Boolean = false;
	tabId: String = '';

	constructor(private _router: Router) { }

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
	}

	onClickTab(tab) {
		this.tabActive = true;

		console.log(tab);
		if (tab === 'login') {
			this.tabId = 'login';
		} else if (tab === 'register') {
			this.tabId = 'register';
		}
	}
	private checkPageUrl(param: string) {
		this.tabActive = true;
		if (param.includes('login')) {
			this.tabId = 'login';
		} else {
			this.tabId = 'register';
		}
	}
}
