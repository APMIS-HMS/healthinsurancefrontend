import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'app works!';
	constructor(private vcr: ViewContainerRef, 
		private toastr: ToastsManager) {
		this.toastr.setRootViewContainerRef(vcr);
	}

	ngOnInit() {
		

	}
}
