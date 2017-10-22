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
import { DummyClaimService } from '../list-claims-payment/claims';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-queued-claims-payment',
  templateUrl: './queued-claims-payment.component.html',
  styleUrls: ['./queued-claims-payment.component.scss']
})
export class QueuedClaimsPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  user: any;
  currentPlatform: any;
  claims: any = [];
  selectedClaims: any = [];
  loading: boolean = true;
  payClaimBtnText: boolean = true;
  payClaimBtnProcessing: boolean = false;
  disablePayBtn: boolean = false;

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
    this._headerEventEmitter.setRouteUrl('Queued Claims Payment List');
    this._headerEventEmitter.setMinorRouteUrl('Queued claims payment list');

    this._getClaimsPayments();
  }

  onCheckSelectedItem(index, claim: Claim) {
    console.log(claim);
    if (!claim.isChecked) {
      this.selectedClaims.push(claim);
    } else {
      // Remove from the selected Claim
      if (this.selectedClaims.length > 0) {
        this.selectedClaims.splice(index, 1);
      }
    }
    console.log(this.selectedClaims);
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

  onCheckAllSelectedItemsToPay(event) {
    this.claims.forEach( (claim, i) => {
      if (event.srcElement.checked) {
        claim.isChecked = true;
        this.selectedClaims.push(claim);
      } else {
        claim.isChecked = false;
        this.selectedClaims = [];
      }
    });
  }

  onClickPayClaim() {
    if (this.selectedClaims.length > 0) {
      console.log(this.selectedClaims);
    } else {
      this._toastr.error('Please select at least one item to pay.', 'No selected Item!');
    }
  }

  private _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getClaimsPayments();
      }
    }).catch(err => {
      console.log(err);
    });
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
