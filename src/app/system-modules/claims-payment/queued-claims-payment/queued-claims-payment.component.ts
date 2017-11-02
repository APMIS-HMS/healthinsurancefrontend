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
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _locker: CoolLocalStorage,
    private _claimsPaymentService: ClaimsPaymentService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Queued Claims Payment List');
    this._headerEventEmitter.setMinorRouteUrl('Queued claims payment list');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);

    this._getCurrentPlatform();
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
    this._systemService.on();
    this._claimsPaymentService.find({
      query: {
        'checkedinDetail.platformOwnerId._id': this.currentPlatform._id,
        isPaymentMade: false
    }}).then((res: any) => {
      console.log(res);
      this.loading = false;
      res.data.forEach(claim => {
        console.log(claim);
        if (claim.checkedinDetail.providerFacilityId._id) {

        }
      });
      this.claims = res.data;
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

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
      this.payClaimBtnText = false;
      this.payClaimBtnProcessing = true;
      this.disablePayBtn = true;
      const claimsIds = [];
      this.selectedClaims.forEach(claim => {
        claimsIds.push(claim._id);
      });

      console.log(this.user);
      const body = {
        claims: claimsIds,
        paidBy: this.user
      };

      this._claimsPaymentService.payMultipleItem(body).then(res => {
        console.log(res);
        this.payClaimBtnText = true;
        this.payClaimBtnProcessing = false;
        this.disablePayBtn = false;
        this.selectedClaims = [];
        this._getClaimsPayments();
        this._toastr.success('Payment completed successfully.', 'Payment completed!');
      }).catch(err => console.log(err));
    } else {
      this._toastr.error('Please select at least one item to pay.', 'No selected Item!');
    }
  }

  private _getCurrentPlatform() {
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res:any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getClaimsPayments();
      }
    }).catch(err => {
      console.log(err);
    });
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
