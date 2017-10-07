import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, CountryService, BankService, ContactPositionService, UserTypeService,
  FacilityService
} from './../../../services/index';
import { HIA } from './../../../models/organisation/hia';
import {
  CountriesService, FacilityTypesService, FacilitiesService, GenderService, PersonService, TitleService, UserService,
  MaritalStatusService, HiaService, HiaNameService, HiaProgramService, HiaPlanService, HiaPositionService
} from '../../../services/api-services/index';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary, Hia, Contact, BankDetail } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

// import { Contact, BankDetail } from '../../../models/index';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-hia',
  templateUrl: './new-hia.component.html',
  styleUrls: ['./new-hia.component.scss']
})
export class NewHiaComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  hias: any = <any>[];
  loading: Boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Health Insurance Agent List');
    this._headerEventEmitter.setMinorRouteUrl('All HIA');

    this._getHIAs();
  }

  private _getHIAs() {
    this._facilityService.find({}).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data > 0) {
        this.hias = res.data;
      }
    }).catch(err => console.log(err));
  }

  navigateNewHIA() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/hia/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }
}
