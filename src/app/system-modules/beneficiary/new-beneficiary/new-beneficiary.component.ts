import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {HeaderEventEmitterService} from '../../../services/event-emitters/header-event-emitter.service';

import {SystemModuleService} from './../../../services/common/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit, AfterViewInit {
  tab_personalData = true;
  tab_dependants = false;
  tab_nok = false;
  tab_program = false;
  tab_confirm = false;
  tab_medical = false;
  user: any;
  selectedBeneficiary: any;
  dependants: any[] = [];
  policy: any;
  isBeneficiary = false;

  constructor(
      private _toastr: ToastsManager,
      private _locker: CoolLocalStorage,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService, private _router: Router,
      private _route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    if (this._router.url.includes('principal')) {
      this.tabPersonalData_click();
    } else if (this._router.url.includes('medical')) {
      this.tabMedicalData_click();
    } else if (this._router.url.includes('dependants')) {
      this.tabDependants_click();
    } else if (this._router.url.includes('next-of-kin')) {
      this.tabNOK_click();
    } else if (this._router.url.includes('program')) {
      this.tabProgram_click();
    } else if (this._router.url.includes('complete')) {
      this.tabConfirm_click();
    }
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
      this.isBeneficiary = true;
    }
    this._headerEventEmitter.setRouteUrl('New Beneficiary');
    this._headerEventEmitter.setMinorRouteUrl('Create new beneficiary');

    this._router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(event => {
      const currentRoute = this._route.root;  // route is an instance of ActiveRoute
      if (event.url.includes('principal')) {
        this.tabPersonalData_click();
      } else if (event.url.includes('medical')) {
        this.tabMedicalData_click();
      } else if (event.url.includes('dependants')) {
        this.tabDependants_click();
      } else if (event.url.includes('next-of-kin')) {
        this.tabNOK_click();
      } else if (event.url.includes('program')) {
        this.tabProgram_click();
      } else if (event.url.includes('complete')) {
        this.tabConfirm_click();
      }
    });
  }

  tabConfirm_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = true;
    this.tab_medical = false;
  }

  tabMedicalData_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = false;
    this.tab_medical = true;
  }

  tabProgram_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = true;
    this.tab_confirm = false;
    this.tab_medical = false;
  }
  tabNOK_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_nok = true;
    this.tab_program = false;
    this.tab_confirm = false;
    this.tab_medical = false;
  }
  tabDependants_click() {
    this.tab_personalData = false;
    this.tab_dependants = true;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = false;
    this.tab_medical = false;
  }
  tabPersonalData_click() {
    this.tab_personalData = true;
    this.tab_dependants = false;
    this.tab_nok = false;
    this.tab_program = false;
    this.tab_confirm = false;
    this.tab_medical = false;
  }
}
