import { PreAuthorizationService } from './../../../services/pre-authorization/pre-authorization.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
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

  authorizations: any[] = [];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _preAuthorizationService: PreAuthorizationService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Pre-Authorization List');
    this._headerEventEmitter.setMinorRouteUrl('All pre-authorizations');
    this._getPreAuthorizations();
  }

  _getPreAuthorizations() {
    this._systemService.on();
    this._preAuthorizationService.find({}).then((payload: any) => {
      console.log(payload.data)
      this.authorizations = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

  navigateDetail(auth) {
    this._router.navigate(['/modules/pre-auth/pre-authorizations', auth._id]).then(payload =>{

    }).catch(err =>{

    })
  }

}
