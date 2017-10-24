import { SystemModuleService } from './../../../services/common/system-module.service';
import { ActivatedRoute } from '@angular/router';
import { PreAuthorizationService } from './../../../services/pre-authorization/pre-authorization.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-pre-authorization-details',
  templateUrl: './pre-authorization-details.component.html',
  styleUrls: ['./pre-authorization-details.component.scss']
})
export class PreAuthorizationDetailsComponent implements OnInit {

  tab_details = true;
  tab_other = false;
  tab_complaints = false;
  tab_referals = false;

  selectedAuthorization: any;

  constructor(
    private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService,
    private _route: ActivatedRoute
  ) {
      this._route.params.subscribe(param => {
        if (param.id !== undefined) {
          this._getAuthorizationDetails(param.id);
        }
      });
    }

  ngOnInit() {

  }

  _getAuthorizationDetails(id) {
    this._systemService.on();
    this._preAuthorizationService.get(id, {}).then(payload => {
      this._systemService.off();
      this.selectedAuthorization = payload;
      this.tab_details = true;
    }).catch(err => {
      this._systemService.off();
    });
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_other = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabOther_click() {
    this.tab_details = false;
    this.tab_other = true;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_complaints = true;
    this.tab_referals = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_complaints = false;
    this.tab_referals = true;
  }
}
