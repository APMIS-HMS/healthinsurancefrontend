import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
export class NewBeneficiaryComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    if (this._router.url.includes('principal')) {
      this.tabPersonalData_click();
    } else if (this._router.url.includes('dependants')) {
      this.tabDependants_click();
    }
    else if (this._router.url.includes('next-of-kin')) {
      this.tabNOK_click();
    }
    else if (this._router.url.includes('program')) {
      this.tabProgram_click();
    }
    else if (this._router.url.includes('complete')) {
      this.tabConfirm_click();
    }
  }

  tab_personalData = true;
  tab_dependants = false;
  tab_nok = false;
  tab_program = false;
  tab_confirm = false;

  selectedBeneficiary: any;
  dependants: any[] = [];
  policy: any;
  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Beneficiary');
    this._headerEventEmitter.setMinorRouteUrl('Create new beneficiary')

    this._router.events.filter((event: any) => event instanceof NavigationEnd)
      .subscribe(
      event => {
        let currentRoute = this._route.root; // route is an instance of ActiveRoute
        console.log(event.url)
        if (event.url.includes('principal')) {
          this.tabPersonalData_click();
        } else if (event.url.includes('dependants')) {
          this.tabDependants_click();
        } else if (event.url.includes('next-of-kin')) {
          this.tabNOK_click();
        } else if (event.url.includes('program')) {
          this.tabProgram_click();
        } else if (event.url.includes('complete')) {
          this.tabConfirm_click();
        }
      }
      );
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
