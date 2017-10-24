import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
// import { IMyDpOptions, IMyDate } from 'mydatepicker';

import { CapitationFeeService, FacilityService, SystemModuleService, UploadService } from '../../../services/index';
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
  selectedFacility: Facility = <Facility>{};

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
  capitationFees: any = <any>[];
  capitationLoading = true;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _toastr: ToastsManager,
    private _uploadService: UploadService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _capitationFeeService: CapitationFeeService,
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Platform Details');
    this._headerEventEmitter.setMinorRouteUrl('Details');

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getPlatformDetails(param.id);
      }
    });

    this._getCurrentPlatform();
    this._getCapitationFees();

    this.capitationFormGroup = this._fb.group({
      amount: [1, [<any>Validators.required]],
      endDate: [new Date(), [<any>Validators.required]]
    });
  }

  onClickApprove(valid: boolean, value: any) {
    if (valid) {
      if (!!this.currentPlatform._id) {
        this.activateCapitationBtnText = false;
        this.activateCapitationBtnProcessing = true;
        this.disableActiveCapitation = true;
        // Remove unrequired data from current platform owner
        delete this.currentPlatform.itContact;
        delete this.currentPlatform.businessContact;
        delete this.currentPlatform.bankDetails;
        delete this.currentPlatform.logo;
        delete this.currentPlatform.address;

        const capitation = {
          amount: value.amount,
          endDate: value.endDate.jsdate,
          platformOwnerId: this.currentPlatform
        };

        this._capitationFeeService.create(capitation).then(res => {
          console.log(res);
          this.activateCapitationBtnText = true;
          this.activateCapitationBtnProcessing = false;
          this.disableActiveCapitation = false;
          this.capitationFormGroup.reset();
          this._getCapitationFees();
          this._toastr.success('Capitation fee has been created successfully.', 'Success!');
        }).catch(err => {
          console.log(err);
          this.activateCapitationBtnText = true;
          this.activateCapitationBtnProcessing = false;
          this.disableActiveCapitation = false;
        });
      } else {
        this._toastr.error('There was a problem trying to get some required resources. Please try again later!',
        'Required Resource Error!');
      }
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
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private _getCapitationFees() {
    this._capitationFeeService.find({
      query: { 'platformOwnerId.shortName': CurrentPlaformShortName,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      this.capitationLoading = false;
      if (res.data.length > 0) {
        this.capitationFees = res.data;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  _getPlatformDetails(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((res: any) => {
      console.log(res);
      this.selectedFacility = res;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateToPlatforms() {
   this._systemService.on()
    this._router.navigate(['/modules/platform/platforms']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigate(route, id) {
    this._systemService.on();
    if (!!id) {
      this._router.navigate([route + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      });
    } else {
      this._router.navigate([route]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      });
    }
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
