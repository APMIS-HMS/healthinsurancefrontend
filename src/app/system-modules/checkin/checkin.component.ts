import { CheckInService } from './../../services/common/check-in.service';
import { EncounterStatusService } from './../../services/common/encounter-status.service';
import { EncounterTypeService } from './../../services/common/encounter-type.service';
import { ClaimStatusService } from './../../services/common/claim-status.service';
import { ClaimTypeService } from './../../services/common/claim-type.service';
import { SystemModuleService } from './../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {



  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
  ) { }

  ngOnInit() {
  }

  

}
