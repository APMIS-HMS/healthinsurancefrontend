import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-pre-authorization-list',
  templateUrl: './pre-authorization-list.component.html',
  styleUrls: ['./pre-authorization-list.component.scss']
})
export class PreAuthorizationListComponent implements OnInit {

  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  
  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private loadingService: LoadingBarService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Pre-Authorization List');
    this._headerEventEmitter.setMinorRouteUrl('All pre-authorizations');
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this.loadingService.startLoading();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }

}
