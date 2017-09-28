import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'app works!';
	constructor(
		public toastr: ToastsManager, vcr: ViewContainerRef, private loadingService: LoadingBarService) {
		this.toastr.setRootViewContainerRef(vcr);
		this.loadingService.startLoading();
	}
}
