import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, FLUTTERWAVE_PUBLIC_KEY } from './../../../services/globals/config';
import { SystemModuleService, UserTypeService, FacilityService, ClaimsPaymentService, ClaimService } from '../../../services/index';
import { Claim } from '../../../models/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-claims-provider-details',
  templateUrl: './claims-provider-details.component.html',
  styleUrls: ['./claims-provider-details.component.scss']
})
export class ClaimsProviderDetailsComponent implements OnInit {
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
  routeId: string;
  refKey: string;
  flutterwaveClientKey: string = FLUTTERWAVE_PUBLIC_KEY;
  totalCost: number = 0;
  payment: string = 'flutterwave'; // This is either flutterwave or paystack

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _locker: CoolLocalStorage,
    private _claimsService: ClaimService,
    private _claimsPaymentService: ClaimsPaymentService
  ) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Unpaid Claims');
    this._headerEventEmitter.setMinorRouteUrl('Claims payment list');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);

    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        this.routeId = param.id;
      }
    });

    this.refKey =
      (this.user ? this.user._id.substr(20) : '') + new Date().getTime();
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
    this._claimsService
      .find({
        query: {
          'checkedinDetail.beneficiaryObject.platformOwnerId._id': this
            .currentPlatform._id,
          providerFacilityId: this.routeId,
          isPaid: false
        }
      })
      .then((res: any) => {
        console.log(res);
        this.loading = false;
        if (res.data.length > 0) {
          this.claims = res.data;
          const facilitiyName =
            res.data[0].checkedinDetail.checkedInDetails.providerFacilityId
              .name;
          this._headerEventEmitter.setMinorRouteUrl(
            'Unpaid claims for ' + facilitiyName
          );
        }
        this._systemService.off();
      })
      .catch(error => {
        console.log(error);
        this._systemService.off();
      });
  }

  onCheckAllSelectedItemsToPay(event) {
    this.claims.forEach((claim, i) => {
      if (event.srcElement.checked) {
        claim.isChecked = true;
        // let value = this.selectedClaims.reduce((t, c) => t.costingApprovalDocumentation + c.costingApprovalDocumentation, 0);
        // console.log(value);
        this.totalCost += claim.costingApprovalDocumentation;
        this.selectedClaims.push(claim);
      } else {
        claim.isChecked = false;
        this.totalCost -= claim.costingApprovalDocumentation;
        this.selectedClaims = [];
      }
    });
    console.log(this.totalCost);
  }

  // onClickPayClaim() {
  //   if (this.selectedClaims.length > 0) {
  //     this.payClaimBtnText = false;
  //     this.payClaimBtnProcessing = true;
  //     this.disablePayBtn = true;
  //     const claimsIds = [];
  //     this.selectedClaims.forEach(claim => {
  //       claimsIds.push(claim._id);
  //     });

  //     console.log(this.user);
  //     const body = {
  //       claims: claimsIds,
  //       paidBy: this.user
  //     };

  //     this._claimsPaymentService
  //       .payMultipleItem(body)
  //       .then(res => {
  //         console.log(res);
  //         this.payClaimBtnText = true;
  //         this.payClaimBtnProcessing = false;
  //         this.disablePayBtn = false;
  //         this.selectedClaims = [];
  //         this._getClaimsPayments();
  //         this._toastr.success(
  //           "Payment completed successfully.",
  //           "Payment completed!"
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   } else {
  //     this._toastr.error(
  //       "Please select at least one item to pay.",
  //       "No selected Item!"
  //     );
  //   }
  // }

  paymentDone(cData) {
    console.log(cData);
    let claims = [];

    if (this.selectedClaims.length > 0) {
      this.selectedClaims.forEach(claim => {
        claims.push(claim._id);
      });

      let flutterwaveRes = {
        data: cData.data.data,
        tx: {
          charged_amount: cData.tx.charged_amount,
          customer: cData.tx.customer,
          flwRef: cData.tx.flwRef,
          txRef: cData.tx.txRef,
          orderRef: cData.tx.orderRef,
          paymentType: cData.tx.paymentType,
          raveRef: cData.tx.raveRef,
          status: cData.tx.status
        }
      };

      let claim = {
        platformOwnerId: this.currentPlatform,
        claims: claims,
        reference: this.payment === 'flutterwave' ? flutterwaveRes : cData,
        paidBy: this.user,
        amount: this.totalCost,
        paymentType: 'e-payment'
      };

      // Create claims payment
      this._claimsPaymentService.create(claim).then((res: any) => {
          console.log(res);
          if (!!res._id) {
            // Call middleware to update the claims.
            const body = { claims: claims, reference: { flwRef: cData.tx.flwRef, raveRef: cData.tx.raveRef }};
            this._claimsPaymentService.payMultipleItem(body).then((paymentRes: any) => {
              console.log(paymentRes);
              if (paymentRes.status === 'success') {
                this.payClaimBtnText = true;
                this.payClaimBtnProcessing = false;
                this.disablePayBtn = false;
                this.selectedClaims = [];
                this._getClaimsPayments();
                this._toastr.success('Payment completed successfully.', 'Payment completed!');
              } else {
                this._toastr.error('There was a problem updating payment.', 'Payment Error!');
              }
            }).catch(err => console.log(err));
          }
        }).catch(err => {
          console.log(err);
        });
    }
  }

  paymentCancel() {
    console.log('Cancelled');
  }

  private _getCurrentPlatform() {
    this._facilityService
      .find({
        query: {
          shortName: CurrentPlaformShortName,
          $select: ['name', 'shortName', 'address.state']
        }
      })
      .then((res: any) => {
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
          this._getClaimsPayments();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on();
      this._router
        .navigate([url + id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    } else {
      this._systemService.on();
      this._router
        .navigate([url])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    }
  }
}
