import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { PreAuthorizationService, SystemModuleService } from '../../../../services/index';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-authorization-others-tab',
  templateUrl: './authorization-others-tab.component.html',
  styleUrls: ['./authorization-others-tab.component.scss']
})
export class AuthorizationOthersTabComponent implements OnInit {
  @Input() selectedAuthorization: any;
  preAuths:any[] = [];
  constructor(
    private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute
  ) {}

  _getAuthorizations() {
    this._systemService.on();
    this._preAuthorizationService.find({
      query:{
        'personId':this.selectedAuthorization.personId._id
      }
    }).then((payload:any) => {
      this._systemService.off();
      this.preAuths = payload.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  ngOnInit() {
    this._getAuthorizations();
  }

}
