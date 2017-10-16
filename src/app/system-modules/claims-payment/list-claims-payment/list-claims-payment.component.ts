import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { SystemModuleService, UserTypeService, FacilityService, ClaimsPaymentService } from '../../../services/index';
import { Claim } from '../../../models/index';
import { DummyClaimService } from './claims';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-claims-payment',
  templateUrl: './list-claims-payment.component.html',
  styleUrls: ['./list-claims-payment.component.scss']
})
export class ListClaimsPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  ffsTabActive:boolean = true;
  cTabActive: boolean = false;
  user: any;
  currentPlatform: any;
  claims: any = [];
  selectedClaims: any = [];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private loadingService: LoadingBarService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _locker: CoolLocalStorage,
    private _claimsPaymentService: ClaimsPaymentService,
    private _getDummyData: DummyClaimService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Claims Payment List');
    this._headerEventEmitter.setMinorRouteUrl('Unpaid Claims payment list');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    this._getClaimsPayments();
  }

  private _getClaimsPayments() {
    this._getDummyData.get().then((res: Claim) => {
      console.log(res);
      this.loading = false;
      this.claims = res;
    });
  }

  // private _getClaimsPayments() {
  //   this._systemService.on();
  //   this._facilityService.find({
  //     query: {
  //       'platformOwnerId._id': this.currentPlatform,
  //       'facilityType._id': this.user.facilityId._id, $limit: 200
  //   }}).then((payload: any) => {
  //     this.loading = false;
  //     this.claims = payload.data;
  //     console.log(this.claims);
  //     this._systemService.off();
  //   }).catch(error => {
  //     console.log(error);
  //     this._systemService.off();
  //   });
  // }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getClaimsPayments();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onCheckQueue(index, event, claim: Claim) {
    console.log(claim);
    if (event.srcElement.checked) {
      this.selectedClaims.push(claim);
    } else {
      // Remove from the selected Claim
      if (this.selectedClaims.length > 0) {
        this.selectedClaims.splice(index, 1);
      }
    }
    console.log(this.selectedClaims);
  }

  onClickQueueForService() {
    if (this.selectedClaims.length > 0) {
      // Save into the Claims Queued Service
      // this._claimsPaymentService.create(this.selectedClaims).then(res => {
      //   console.log(res);
      // }).catch(err => console.log(err));
    } else {
      this._toastr.error('Please check items on the list', 'Checkbox Validation!');
    }
  }

  onClickTab(tabName: string) {
    if (tabName === 'feeForService') {
      this.ffsTabActive = true;
      this.cTabActive = false;
    } else {
      this.ffsTabActive = false;
      this.cTabActive = true;
    }
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this.loadingService.startLoading();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }
}
