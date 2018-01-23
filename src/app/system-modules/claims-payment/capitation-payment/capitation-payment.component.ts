import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, FLUTTERWAVE_PUBLIC_KEY } from '../../../services/globals/config';
import { SystemModuleService, FacilityService, CapitationFeeService, PolicyService } from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-capitation-payment',
  templateUrl: './capitation-payment.component.html',
  styleUrls: ['./capitation-payment.component.scss']
})
export class CapitationPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  currentPlatform: any;
  capitations: any = <any>[];
  selectedCapitations: any = <any>[];
  loading: boolean = true;
  totalCost: number = 0;
  totalQuantity: number = 0;
  cBtnText: boolean = true;
  cBtnProcessing: boolean = false;
  cDisableBtn: boolean = false;
  user: any;
  payClaim: boolean = false;
  hiaDetails: any = <any>{};
  selectedClaims: any = [];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _capitationFeeService: CapitationFeeService,
    private _policyService: PolicyService
  ) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Capitation Payment');
    this._headerEventEmitter.setMinorRouteUrl('Capitation list');

    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);

    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        // this._getPolicy(param.id);
        this._getCurrentPlatform(param.id);
      }
    });
  }

  onCheckSelectedItem(index, capitation: any) {
    console.log(capitation);
    if (!capitation.isChecked) {
      this.selectedClaims.push(capitation);
    } else {
      // Remove from the selected Claim
      if (this.selectedClaims.length > 0) {
        this.selectedClaims.splice(index, 1);
      }
    }
    console.log(this.selectedClaims);
  }

  onCheckAllSelectedItemsToPay(event) {
    this.capitations.forEach((capitation, i) => {
      if (event.srcElement.checked) {
        capitation.isChecked = true;
        // let value = this.selectedClaims.reduce((t, c) => t.costingApprovalDocumentation + c.costingApprovalDocumentation, 0);
        // console.log(value);
        // this.totalCost += capitation.costingApprovalDocumentation;
        this.selectedClaims.push(capitation);
      } else {
        capitation.isChecked = false;
        // this.totalCost -= capitation.costingApprovalDocumentation;
        this.selectedClaims = [];
      }
    });
    console.log(this.totalCost);
  }

  // onCheckAllQueue(isChecked) {
  //   console.log(isChecked);
  //   let counter = 0;
  //   this.capitations.forEach(policy => {
  //     counter++;
  //     policy.isChecked = isChecked;

  //     if (policy.isChecked) {
  //       this.totalQuantity++;
  //       this.totalCost += policy.premiumPackageId.amount;
  //       this.selectedCapitations.push(policy);
  //     } else {
  //       this.totalQuantity--;
  //       this.totalCost -= policy.premiumPackageId.amount;
  //     }
  //   });

  //   if (counter === this.capitations.length && !isChecked) {
  //     this.selectedCapitations = [];
  //   }

  //   // } else {
  //   //   // Remove from the selected Claim
  //   //   console.log(index);
  //   //   policy.isChecked = false;
  //   //   this.selectedOrganizationPolicies = this.selectedOrganizationPolicies.filter(x => x._id !== policy._id);
  //   // }
  // }

  // onCheckQueue(index, policy) {
  //   console.log(policy);
  //   if (policy.isChecked === undefined) {
  //     policy.isChecked = true;
  //     this.selectedCapitations.push(policy);
  //   } else if (!policy.isChecked) {
  //     console.log(policy.isChecked);

  //     let found: boolean = false;
  //     policy.isChecked = true;
  //     this.selectedCapitations = this.selectedCapitations.filter(x => x._id !== policy._id);
  //     // let cLength = this.selectedCapitations.length;

  //     // if (cLength > 0) {
  //     //   while (cLength--) {
  //     //     console.log(this.selectedCapitations[cLength]);
  //     //   }
  //     // } else {
  //     //   this.selectedCapitations.push(policy);
  //     // }
  //     // this.selectedCapitations.forEach(e => {
  //     //   if (e => e._id === policy._id) {
  //     //     found = true;
  //     //   } else {
  //     //     found = false;
  //     //   }
  //     // });

  //     // if (!found) {
  //     //   this.selectedCapitations.push(policy);
  //     // }
  //   } else {
  //     policy.isChecked = false;
  //     this.selectedCapitations = this.selectedCapitations.filter(x => x._id !== policy._id);
  //   }
  //   console.log(this.selectedCapitations);
  // }

  // onClickPayItemsSelected() {
  //   console.log('Ready to pay');
  // }

  // paymentDone(cData) {
  //   console.log(cData);
  //   let policies = [];
  //   // All policies that is being paid for.
  //   let i = this.selectedCapitations.length;
  //   while (i--) {
  //     console.log(this.selectedCapitations[i]);
  //     policies.push({
  //       policyId: this.selectedCapitations[i].policyId,
  //       policyCollectionId: this.selectedCapitations[i]._id
  //     });
  //   }

  //   let flutterwaveRes = {
  //     data: cData.data.data,
  //     tx:  {
  //       charged_amount: cData.tx.charged_amount,
  //       customer: cData.tx.customer,
  //       flwRef: cData.tx.flwRef,
  //       txRef: cData.tx.txRef,
  //       orderRef: cData.tx.orderRef,
  //       paymentType: cData.tx.paymentType,
  //       raveRef: cData.tx.raveRef,
  //       status: cData.tx.status
  //     }
  //   };

  //   console.log(policies);
  //   console.log(flutterwaveRes);
  //   // Call middleware
  // }

  // paymentCancel() {
  //   console.log('cancelled');
  // }

  onClickShowPayClaim() {
    this.payClaim = !this.payClaim;
  }

  private _getPolicy(id: string) {
    console.log(id);
    // { name: { $regex: value, '$options': 'i' } },
    this._policyService.find({
      query: {
        // 'platformOwnerId._id': this.currentPlatform._id,
        'providerId._id': { $regex: id, '$options': 'i' },
        
        // isActive: true,
        // isPaid: true,
      }
    }).then((res: any) => {
      console.log(res);
      this.loading = false;
      this._systemService.off();
      if (res.data.length > 0) {
        this.capitations = res.data;
        this._headerEventEmitter.setMinorRouteUrl(res.data[0].providerId.name);
      }
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getCurrentPlatform(providerId) {
    this._facilityService.find({
      query: {
        shortName: CurrentPlaformShortName,
        $select: ['name', 'shortName', 'address.state']
      }
    }).then((res: any) => {
      if (res.data.length > 0) {
        if (res.data.length > 0) {
          console.log(res);
          this.currentPlatform = res.data[0];
          this._getPolicy(providerId);
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  modal_close() {
    this.payClaim = false;
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      });
    }
  }
}
