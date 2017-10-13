import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit {

  tab_personalData = true;
  tab_dependants = false;
  tab_nok = false;
  tab_program = false;
  tab_confirm = false;

  selectedBeneficiary: any;
  dependants: any[] = [];
  policy:any;
  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService
  ) {
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      this.selectedBeneficiary = value.beneficiary;
      if(value.dependants !== undefined){
        this.dependants = value.dependants;
      }
      if(value.policy !== undefined){
        this.policy = value.policy;
      }
      if (value.tab === 'One') {
        this.tab_personalData = true;
        this.tab_dependants = false;
        this.tab_nok = false;
        this.tab_program = false;
        this.tab_confirm = false;
      } else if (value.tab === 'Two') {
        this.tab_personalData = false;
        this.tab_dependants = true;
        this.tab_nok = false;
        this.tab_program = false;
        this.tab_confirm = false;
      } else if (value.tab === 'Three') {
        this.tab_personalData = false;
        this.tab_dependants = false;
        this.tab_nok = true;
        this.tab_program = false;
        this.tab_confirm = false;
      } else if (value.tab === 'Four') {
        this.tab_personalData = false;
        this.tab_dependants = false;
        this.tab_nok = false;
        this.tab_program = true;
        this.tab_confirm = false;
      } else if (value.tab === 'Five') {
        this.tab_personalData = false;
        this.tab_dependants = false;
        this.tab_nok = false;
        this.tab_program = false;
        this.tab_confirm = true;
      }
    })
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Beneficiary');
    this._headerEventEmitter.setMinorRouteUrl('');
  }

  tabConfirm_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = true;
  }
  tabProgram_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = true;
    this.tab_confirm = false;
  }
  tabNOK_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = true;
    this.tab_program = false;
    this.tab_confirm = false;
  }
  tabDependants_click() {
    this.tab_personalData = false;
    this.tab_dependants = true;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = false;
  }
  tabPersonalData_click() {
    this.tab_personalData = true;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = false;
  }
}
