import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {environment} from '../../../../../environments/environment';
import {HeaderEventEmitterService} from '../../../../services/event-emitters/header-event-emitter.service';
import {PreAuthorizationService, SystemModuleService} from '../../../../services/index';

@Component({
  selector: 'app-authorization-others-tab',
  templateUrl: './authorization-others-tab.component.html',
  styleUrls: ['./authorization-others-tab.component.scss']
})
export class AuthorizationOthersTabComponent implements OnInit {
  @Input() selectedAuthorization: any;
  preAuths: any[] = [];
  platformName: string;
  constructor(
      private _preAuthorizationService: PreAuthorizationService,
      private _systemService: SystemModuleService,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _route: ActivatedRoute) {
    this.platformName = environment.platform;
  }

  _getAuthorizations() {
    this._systemService.on();
    this._preAuthorizationService
        .find({query: {'personId': this.selectedAuthorization.personId._id}})
        .then((payload: any) => {
          this._systemService.off();
          this.preAuths = payload.data;
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  ngOnInit() {
    this._getAuthorizations();
  }
}
