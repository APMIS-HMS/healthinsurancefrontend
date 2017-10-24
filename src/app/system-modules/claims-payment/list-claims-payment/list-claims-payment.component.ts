import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { SystemModuleService, UserTypeService, FacilityService, ClaimService, ClaimsPaymentService } from '../../../services/index';
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
  selectedFFSClaims: any = [];
  selectedCClaims: any = [];
  loading: boolean = true;
  qFFSBtnText: boolean = true;
  qFFSBtnProcessing: boolean = false;
  qFFSDisableBtn: boolean = false;
  qCBtnText: boolean = true;
  qCBtnProcessing: boolean = false;
  qCDisableBtn: boolean = false;

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
    private _getDummyData: DummyClaimService,
    private _claimService: ClaimService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Claims Payment List');
    this._headerEventEmitter.setMinorRouteUrl('Unpaid Claims payment list');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);

    this._getCurrentPlatform();
  }

  // private _getClaimsPayments() {
  //   this._getDummyData.get().then((res: Claim[]) => {
  //     console.log(res);
  //     this.loading = false;
  //     this.claims = res.filter(e => !e.isQueuedForPayment);
  //   });
  // }

  private _getClaimsPayments() {
    this._systemService.on();
    this._claimService.find({
      query: {
        'checkedinDetail.platformOwnerId._id': this.currentPlatform._id,
         isQueuedForPayment: false,
         'approvedDocumentation.response.isApprove': true
    }}).then((payload: any) => {
      console.log(payload);
      this.loading = false;
      this.claims = payload.data;
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        console.log(res);
        this.currentPlatform = res.data[0];
        this._getClaimsPayments();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onCheckFFSQueue(index, claim: Claim) {
    if (!claim.isChecked) {
      claim.isChecked = true;
      claim.isQueuedForPayment = true;
      this.selectedFFSClaims.push(claim);
    } else {
      // Remove from the selected Claim
      console.log(index);
      claim.isChecked = false;
      claim.isQueuedForPayment = false;
      if (this.selectedFFSClaims.length > 0) {
        this.selectedFFSClaims.splice(index, 1);
      }
    }
  }

  onCheckCQueue(index, event, claim: Claim) {
    if (event.srcElement.checked) {
      this.selectedCClaims.push(claim);
    } else {
      // Remove from the selected Claim
      if (this.selectedCClaims.length > 0) {
        this.selectedCClaims.splice(index, 1);
      }
    }
  }

  onClickFFSQueueItemsSelected() {
    this.qFFSBtnText = false;
    this.qFFSBtnProcessing = true;
    this.qFFSDisableBtn = true;
    const claimsIds = [];
    this.selectedFFSClaims.forEach(claim => {
      claimsIds.push(claim._id);
    });

    const body = {
      claims: claimsIds
    };

    this._claimsPaymentService.createMultipleItem(body).then((res: any) => {
      console.log(res);
      this.qFFSBtnText = true;
      this.qFFSBtnProcessing = false;
      this.qFFSDisableBtn = false;
      if (res.status && res.statusCode === 200) {
        this._toastr.success('Selected claims has been queued successfully!', 'Queueing Success!');
        this._getClaimsPayments();
      } else {
        this._toastr.error('There was a problem queueing claims. Please try again later!', 'Queueing Error!');
      }
    }).catch(err => console.log(err));
  }

  onClickCQueueItemsSelected() {
    console.log(this.selectedCClaims);
  }

  onCheckAllFFSToQueue(event) {
    this.claims.forEach( (claim, i) => {
      if (event.srcElement.checked) {
        claim.isChecked = true;
        this.selectedFFSClaims.push(claim);
      } else {
        claim.isChecked = false;
        this.selectedFFSClaims = [];
      }
    });
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

  navigate(url: string, id?: string) {
    if (!!id) {
     this._systemService.on()
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
     this._systemService.on()
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }
}
