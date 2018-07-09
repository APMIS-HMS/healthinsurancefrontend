import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable, Subscription} from 'rxjs/Rx';

import {environment} from '../../../../environments/environment';
import {Claim} from '../../../models/index';
import {ClaimService, ClaimsPaymentService, FacilityService, SystemModuleService, UserTypeService} from '../../../services/index';

import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';

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
  payClaim: boolean = false;
  disablePayBtn: boolean = false;
  routeId: string;
  totalCost: number = 0;
  hiaDetails: any = <any>{};
  platformName: any;

  constructor(
      private _router: Router, private _route: ActivatedRoute,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _systemService: SystemModuleService,
      private _facilityService: FacilityService,
      private _userTypeService: UserTypeService,
      private _locker: CoolLocalStorage, private _claimsService: ClaimService,
      private _claimsPaymentService: ClaimsPaymentService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Unpaid Claims');
    this._headerEventEmitter.setMinorRouteUrl('Claims payment list');
    this.user = (<any>this._locker.getObject('auth')).user;

    this._route.params.subscribe(param => {
      if (!!param.id) {
        this.routeId = param.id;
      }
    });

    this._getCurrentPlatform(this.routeId);
  }

  onCheckSelectedItem(index: number, claim: Claim, isChecked: boolean) {
    if (isChecked) {
      this.totalCost += claim.costingApprovalDocumentation;
      this.selectedClaims.push(claim);
    } else {
      // Remove from the selected Claim
      this.totalCost -= claim.costingApprovalDocumentation;
      this.selectedClaims = this.selectedClaims.filter(x => x._id !== claim._id);
    }
  }

  private _getClaimsPayments(query: any) {
    this._systemService.on();
    this._claimsService.find(query).then((res: any) => {
      this.loading = false;
      if (res.data.length > 0) {
        this.claims = res.data;
        this.hiaDetails = res.data[0].checkedinDetail.policyId.hiaId;
        const facilitiyName = res.data[0].checkedinDetail.checkedInDetails.providerFacilityId.name;
        this._headerEventEmitter.setMinorRouteUrl('Unpaid claims for ' + facilitiyName);
      }
      this._systemService.off();
    }).catch(error => {
      this._systemService.off();
    });
  }

  onCheckAllSelectedItemsToPay(isChecked: boolean) {
    this.claims.forEach(claim => {
      if (isChecked) {
        claim.isChecked = true;
        this.totalCost += claim.costingApprovalDocumentation;
        this.selectedClaims.push(claim);
      } else {
        claim.isChecked = false;
        this.totalCost -= claim.costingApprovalDocumentation;
        this.selectedClaims =
            this.selectedClaims.filter(x => x._id !== claim._id);
      }
    });
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

  // paymentDone(cData) {
  //   console.log(cData);
  //   let claims = [];

  //   if (this.selectedClaims.length > 0) {
  //     this.selectedClaims.forEach(claim => {
  //       claims.push(claim._id);
  //     });

  //     let flutterwaveRes = {
  //       data: cData.data.data,
  //       tx: {
  //         charged_amount: cData.tx.charged_amount,
  //         customer: cData.tx.customer,
  //         flwRef: cData.tx.flwRef,
  //         txRef: cData.tx.txRef,
  //         orderRef: cData.tx.orderRef,
  //         paymentType: cData.tx.paymentType,
  //         raveRef: cData.tx.raveRef,
  //         status: cData.tx.status
  //       }
  //     };

  //     let claim = {
  //       platformOwnerId: this.currentPlatform,
  //       claims: claims,
  //       reference: this.payment === 'flutterwave' ? flutterwaveRes : cData,
  //       paidBy: this.user,
  //       amount: this.totalCost,
  //       paymentType: 'e-payment'
  //     };

  //     // Create claims payment
  //     this._claimsPaymentService.create(claim).then((res: any) => {
  //         console.log(res);
  //         if (!!res._id) {
  //           // Call middleware to update the claims.
  //           const body = { claims: claims, reference: { flwRef:
  //           cData.tx.flwRef, raveRef: cData.tx.raveRef }};
  //           this._claimsPaymentService.payMultipleItem(body).then((paymentRes:
  //           any) => {
  //             console.log(paymentRes);
  //             if (paymentRes.status === 'success') {
  //               this.payClaimBtnText = true;
  //               this.payClaimBtnProcessing = false;
  //               this.disablePayBtn = false;
  //               this.selectedClaims = [];
  //               this._getClaimsPayments();
  //               this._toastr.success('Payment completed successfully.',
  //               'Payment completed!');
  //             } else {
  //               this._toastr.error('There was a problem updating payment.',
  //               'Payment Error!');
  //             }
  //           }).catch(err => console.log(err));
  //         }
  //       }).catch(err => {
  //         console.log(err);
  //       });
  //   }
  // }

  paymentCancel() {
    console.log('Cancelled');
  }

  private _getCurrentPlatform(providerId) {
    this._facilityService.find({
      query: {
        shortName: this.platformName,
        $select: ['name', 'shortName', 'address.state']
      }
    }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        if (!!this.user.userType && this.user.userType.name === 'Platform Owner') {
          this._getClaimsPayments({
            query: {
              'checkedinDetail.beneficiaryObject.platformOwnerId._id': this.currentPlatform._id,
              providerFacilityId: providerId,
              isPaid: false
            }
          });
        } else if (!!this.user.userType && this.user.userType.name === 'Health Insurance Agent') {
          this._getClaimsPayments({
            query: {
              'checkedinDetail.beneficiaryObject.platformOwnerId._id': this.currentPlatform._id,
              'checkedinDetail.policyId.hiaId._id': this.user.facilityId._id,
              providerFacilityId: providerId,
              isPaid: false
            }
          });
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onClickShowPayClaim() {
    this.payClaim = !this.payClaim;
  }

  modal_close() {
    this.payClaim = false;
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this._systemService.on();
      this._router.navigate([url])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    }
  }
}
