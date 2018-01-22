import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, TABLE_LIMIT_PER_VIEW } from './../../../services/globals/config';
import {
  SystemModuleService, UserTypeService, FacilityService, ClaimService, ClaimsPaymentService,
  CapitationFeeService, PolicyService, BeneficiaryService
} from '../../../services/index';
import { Claim } from '../../../models/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: "app-list-claims-payment",
  templateUrl: './list-claims-payment.component.html',
  styleUrls: ['./list-claims-payment.component.scss']
})
export class ListClaimsPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  ffsTabActive: boolean = true;
  cTabActive: boolean = false;
  user: any;
  currentPlatform: any;
  claims: any = [];
  capitationClaims: any = [];
  selectedFFSClaims: any = [];
  selectedCClaims: any = [];
  loading: boolean = true;
  qFFSBtnText: boolean = true;
  qFFSBtnProcessing: boolean = false;
  qFFSDisableBtn: boolean = false;
  qCBtnText: boolean = true;
  qCBtnProcessing: boolean = false;
  qCDisableBtn: boolean = false;
  capitationPrice: any;
  claimsTotalEntries: number;
  capitationClaimsTotalEntries: number;
  showClaimsLoadMore: any = true;
  showCapitationClaimsLoadMore: any = true;
  limit: number = TABLE_LIMIT_PER_VIEW;
  claimsResetData: Boolean;
  capitationClaimsResetData: Boolean;
  index: number = 0;

  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _locker: CoolLocalStorage,
    private _claimsPaymentService: ClaimsPaymentService,
    private _claimService: ClaimService,
    private _beneficiaryService: BeneficiaryService,
    private _capitationFeeService: CapitationFeeService,
    private _policyService: PolicyService
  ) {}

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
    console.log(this.currentPlatform);
    this._claimService.find({
        query: {
          'checkedinDetail.beneficiaryObject.platformOwnerId._id': this.currentPlatform._id,
          isPaid: false,
          'approvedDocumentation.response.isApprove': true,
          $limit: this.limit,
          $skip: this.limit * this.index
        }
      }).then((res: any) => {
        console.log(res);
        this.loading = false;
        // Group claims based on provider
        let i = res.data.length;
        while (i--) {
          console.log(res.data[i]);
          let claim = res.data[i];
          const providerId = claim.checkedinDetail.checkedInDetails.providerFacilityId._id;
          let hasItem = this.claims.filter(e => providerId === e.checkedinDetail.checkedInDetails.providerFacilityId._id);

          if (hasItem.length === 0) {
            claim.noOfClaims = 1;
            claim.totalCost = claim.costingApprovalDocumentation;
            this.claims.push(claim);
          } else {
            hasItem[0].totalCost += claim.costingApprovalDocumentation;
            hasItem[0].noOfClaims++;
          }
        }
        // this.claims = res.data;
        // this.claimsTotalEntries = res.total;
        // if (this.claimsResetData !== true) {
        //   this.claims.push(...res.data);
        // } else {
        //   this.claimsResetData = false;
        //   this.claims = res.data;
        // }
        // if (this.claims.length >= this.claimsTotalEntries) {
        //   this.showClaimsLoadMore = false;
        // }
        this._systemService.off();
      }).catch(error => {
        console.log(error);
        this._systemService.off();
      });
  }

  private _getClaimsCapitationFromPolicy() {
    this._systemService.on();
    this._policyService.find({
        query: {
          'platformOwnerId._id': this.currentPlatform._id,
          isActive: true,
          isPaid: true,
          $limit: this.limit,
          $skip: this.limit * this.index
        }
      }).then((res: any) => {
        console.log(res);
        this.loading = false;
        let i = res.data.length;

        while (i--) {
          console.log(res.data[i]);
          let policy = res.data[i];
          let hasItem = this.capitationClaims.filter(e => e.providerId._id === policy.providerId._id);

          if (hasItem.length === 0) {
            policy.noOfBeneficiaries = 1;
            this.capitationClaims.push(policy);
          } else {
            hasItem[0].noOfBeneficiaries++;
          }
        }

        console.log(this.capitationClaims);

        // this.capitationClaimsTotalEntries = res.total;
        // if (this.capitationClaimsResetData !== true) {
        //   this.capitationClaims.push(...res.data);
        // } else {
        //   this.capitationClaimsResetData = false;
        //   this.capitationClaims = res.data;
        // }
        // if (this.capitationClaims.length >= this.capitationClaimsTotalEntries) {
        //   this.showClaimsLoadMore = false;
        // }
        this._systemService.off();
      }).catch(error => {
        console.log(error);
        this._systemService.off();
      });
  }

  private _getClaimsCapitationPrice() {
    this._systemService.on();
    this._capitationFeeService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        isActive: true
      }
    }).then((res: any) => {
      console.log(res);
      this.capitationPrice = res.data[0];
      this._getClaimsCapitationFromPolicy();
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getCurrentPlatform() {
    this._facilityService.find({
      query: {
        shortName: CurrentPlaformShortName,
        $select: ['name', 'shortName', 'address.state']
      }
    }).then((res: any) => {
      if (res.data.length > 0) {
        console.log(res);
        this.currentPlatform = res.data[0];
        this._getClaimsPayments();
        this._getClaimsCapitationPrice();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // _getCurrentPlatform() {
  //   this._facilityService
  //     .find({ query: { shortName: CurrentPlaformShortName } })
  //     .then((res: any) => {
  //       if (res.data.length > 0) {
  //         console.log(res);
  //         this.currentPlatform = res.data[0];
  //         this._getClaimsPayments();
  //         this._getClaimsCapitationPrice();
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

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

    delete this.user.roles;
    const body = {
      claims: claimsIds,
      queuedBy: this.user
    };

    // this._claimsPaymentService.createMultipleItem(body).then((res: any) => {
    //     console.log(res);
    //     this.qFFSBtnText = true;
    //     this.qFFSBtnProcessing = false;
    //     this.qFFSDisableBtn = false;
    //     if (res.status === 'success') {
    //       this._toastr.success("Selected claims has been queued successfully!", "Queueing Success!");
    //       this._getClaimsPayments();
    //       this._router.navigate(["/modules/claims/queued-claims"]);
    //     } else {
    //       this._toastr.error("There was a problem queueing claims. Please try again later!", "Queueing Error!");
    //     }
    //   }).catch(err => console.log(err));
  }

  onClickCQueueItemsSelected() {
    console.log(this.selectedCClaims);
  }

  onCheckAllFFSToQueue(event) {
    this.claims.forEach((claim, i) => {
      if (event.srcElement.checked) {
        claim.isChecked = true;
        this.selectedFFSClaims.push(claim);
      } else {
        claim.isChecked = false;
        this.selectedFFSClaims = [];
      }
    });
  }

  onCheckPayAllCapitation() {
    console.log('Capitation Payment');
  }

  onCheckPayItemCapitation() {
    console.log('Item Capitation');
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
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

  claimsLoadMore() {
    this._getClaimsPayments();
  }
  capitationClaimsLoadMore() {
    this._getClaimsCapitationPrice();
  }

  claimsReset() {
    this.index = 0;
    this.claimsResetData = true;
    this._getClaimsPayments();
    this.showClaimsLoadMore = true;
  }
  capitationClaimsReset() {
    this.index = 0;
    this.claimsResetData = true;
    this._getClaimsCapitationPrice();
    this.showClaimsLoadMore = true;
  }
}
