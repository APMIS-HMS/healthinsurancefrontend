import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
// import { IMyDpOptions, IMyDate } from 'mydatepicker';

import { CapitationFeeService, FacilityService, SystemModuleService } from '../../../services/index';
import { Facility } from '../../../models/index';
import { CurrentPlaformShortName, FORM_VALIDATION_ERROR_MESSAGE } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-platform-details',
  templateUrl: './platform-details.component.html',
  styleUrls: ['./platform-details.component.scss']
})
export class PlatformDetailsComponent implements OnInit {
  listsearchControl = new FormControl();
  premiumsearchControl = new FormControl();
  capitationFormGroup: FormGroup;

  tabPlatform = true;
  tabHia = false;
  tabProvider = false;
  tabEmployer = false;
  tabBeneficiary = false;
  tabCapitation = false;
  activateCapitationBtnProcessing = false;
  activateCapitationBtnText = true;
  disableActiveCapitation = false;
  currentPlatform: Facility = <Facility>{};

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _facilityService: FacilityService,
    private _toastr: ToastsManager,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _capitationFeeService: CapitationFeeService,
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Platform Details');
    this._headerEventEmitter.setMinorRouteUrl('Details');

    this._getCurrentPlatform();

    this.capitationFormGroup = this._fb.group({
      amount: ['', [<any>Validators.required]],
      endDate: ['', [<any>Validators.required]]
    });
  }

  onClickApprove(valid: boolean, value: any) {
    if (valid) {
      console.log(value);
      const capitation = {
        amount: value.amount,
        endDate: value.endDate,
        platformOwnerId: this.currentPlatform
      };

      this._capitationFeeService.create(capitation).then().catch(err => console.log(err));
    }
  }

  onClickDeactivateCapitation() {
    console.log('Deactivate');
  }

  onClickCancelCapitation() {
    this.capitationFormGroup.reset();
  }

  private _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        console.log(this.currentPlatform);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  navigateToPlatforms() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/platform/platforms']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

  tabClick(link: String) {
    switch (link) {
      case 'platform':
        this.tabPlatform = true;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        this.tabCapitation = false;
        break;
      case 'hia':
        this.tabPlatform = false;
        this.tabHia = true;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        this.tabCapitation = false;
        break;
      case 'provider':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = true;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        this.tabCapitation = false;
        break;
      case 'employer':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = true;
        this.tabBeneficiary = false;
        this.tabCapitation = false;
        break;
      case 'beneficiary':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = true;
        this.tabCapitation = false;
        break;
      case 'capitation':
        this.tabPlatform = false;
        this.tabHia = false;
        this.tabProvider = false;
        this.tabEmployer = false;
        this.tabBeneficiary = false;
        this.tabCapitation = true;
        break;
    } 
  }

}
