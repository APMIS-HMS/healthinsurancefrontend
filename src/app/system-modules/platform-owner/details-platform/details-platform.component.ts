import { SystemModuleService } from './../../../services/common/system-module.service';
import { FacilityService } from './../../../services/common/facility.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-platform',
  templateUrl: './details-platform.component.html',
  styleUrls: ['./details-platform.component.scss']
})
export class DetailsPlatformComponent implements OnInit {

  showEmp = false;
  showProviders = false;
  showEmployers = false;
  showHias = true;

  platform = "LASHMA";
  selectedPlaform: any;

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Platform Details');
    this._headerEventEmitter.setMinorRouteUrl('');
    this._route.params.subscribe(value => {
      console.log(value)
      this._getPlatform(value.id);
    })
  }
  _getPlatform(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then(platform => {
      this.selectedPlaform = platform;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }
  hias_show() {
    this.showEmp = false;
    this.showEmployers = false;
    this.showHias = true;
    this.showProviders = false;
  }
  employees_show() {
    this.showEmp = true;
    this.showEmployers = false;
    this.showHias = false;
    this.showProviders = false;
  }
  employers_show() {
    this.showEmp = false;
    this.showEmployers = true;
    this.showHias = false;
    this.showProviders = false;
  }
  providers_show() {
    this.showEmp = false;
    this.showEmployers = false;
    this.showHias = false;
    this.showProviders = true;
  }

}
