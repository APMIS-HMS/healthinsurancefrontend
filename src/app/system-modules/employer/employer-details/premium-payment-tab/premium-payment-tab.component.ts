import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../../services/globals/config';
import {
  SystemModuleService, FacilityService, PolicyService, PremiumPaymentService
} from '../../../../services/index';
import { Policy } from '../../../../models/index';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-premium-payment-tab',
  templateUrl: './premium-payment-tab.component.html',
  styleUrls: ['./premium-payment-tab.component.scss']
})
export class PremiumPaymentTabComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  employer = new FormControl();
  dateRange = new FormControl();
  unbatchedLoading: boolean = true;
  batchedLoading: boolean = true;
  unbatchedActiveTab: boolean = true;
  batchedActiveTab: boolean = false;
  unbatchedPolicies: any = <any>[];
  batchedPolicies: any = <any>[];
  constructor() { }

  ngOnInit() {
  }

}
