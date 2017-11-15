import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../../../services/globals/config';
import {
  SystemModuleService, FacilityService, PolicyService, PremiumPaymentService
} from '../../../../../services/index';
import { Policy } from '../../../../../models/index';
import { HeaderEventEmitterService } from '../../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-unbatched',
  templateUrl: './unbatched.component.html',
  styleUrls: ['./unbatched.component.scss']
})
export class UnbatchedComponent implements OnInit {
  @Input() isDoneSavingPolicies: any;
  user: any;
  loading: boolean = true;
  policies: any = <any>[];
  paymentType: string = 'e-Payment';
  selectedPolicies: any = <any>[];
  totalCost: number = 0;
  totalItem: number = 0;
  premiumPaymentData: any;
  currentPlatform: any;
  

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _policyService: PolicyService,
    private _premiumPaymentService: PremiumPaymentService
  ) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();

    console.log(this.isDoneSavingPolicies);
  }

  private _getUnbatchedPolicies() {
    console.log(this.currentPlatform);
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        isPaid: false,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      console.log(res);
      this.loading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.policies.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getUnbatchedPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  onCheckAllToPay(isChecked) {
    // if (!isChecked) {
    let counter = 0;
    this.policies.forEach(policy => {
      console.log(policy);
      counter++;
      policy.isChecked = isChecked;

      if (policy.isChecked) {
        this.totalItem++;
        this.totalCost += policy.premiumPackageId.amount;
        this.selectedPolicies.push(policy);
        this._premiumPaymentService.setPolicy(this.selectedPolicies);
        // this.outputSelectedPolicies = this.selectedPolicies;
      } else {
        this.totalItem--;
        this.totalCost -= policy.premiumPackageId.amount;
      }
      // this.outputSelectedPolicies = this.selectedPolicies;
    });

    if ((counter === this.policies.length) && !isChecked) {
      this.selectedPolicies = [];
      // this.outputSelectedPolicies = [];
    }
    console.log(this.policies);
    console.log(this.selectedPolicies);
    // } else {
    //   // Remove from the selected Claim
    //   console.log(index);
    //   policy.isChecked = false;
    //   this.selectedOrganizationPolicies = this.selectedOrganizationPolicies.filter(x => x._id !== policy._id);
    // }
  }

  onCheckSelectedToPay(index: number, policy: Policy) {
    console.log(policy);
    if (!policy.isChecked) {
      policy.isChecked = true;
      this.selectedPolicies.push(policy);
    } else {
      policy.isChecked = false;
      this.selectedPolicies = this.selectedPolicies.filter(x => x._id !== policy._id);
      console.log(this.selectedPolicies);
    }

    // Send policy to the parent component
    // this.selectedPolicy(this.selectedPolicies);
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }

  onClickResetComponent(event) {
    console.log(event);
  }

  // public selectedPolicy(policy: any): void {
  //   this.onPolicySelected.emit(policy);
  // }

  // onClickCreateAndPaybatch(valid: boolean, value: any) {
  //   this.paystackProcessing = true;
  //   console.log(value);
  //   let policies = [];
  //   // All policies that is being paid for.
  //   this.selectedPolicies.forEach(policy => {
  //     if (policy.isChecked) {
  //       policies.push({
  //         policyId: policy.policyId,
  //         policyCollectionId: policy._id
  //       });
  //     }
  //   });

  //   let user = {
  //     userType: this.user.userType,
  //     firstName: this.user.firstName,
  //     lastName: this.user.lastName,
  //     facilityId: this.user.facilityId,
  //     email: this.user.email,
  //     isActive: this.user.isActive,
  //     platformOwnerId: (!!this.user.platformOwnerId) ? this.user.platformOwnerId : '',
  //     phoneNumber: this.user.phoneNumber
  //   };

  //   let ref = {
  //     platformOwnerId: this.currentPlatform,
  //     policies: policies,
  //     paidBy: user,
  //     requestedAmount: this.totalCost,
  //     amountPaid: 0,
  //     paymentType: value.paymentType,
  //     batchNo: value.batchNo
  //   };

  //   console.log(ref);
  //   // Create batch, if successful, enable the paystack button.
  //   this._premiumPaymentService.create(ref).then((res: any) => {
  //     if (!!res._id) {
  //       this.showPaystack = true;
  //       this.premiumPaymentData = res;
  //       console.log(res);
  //     }
  //   }).catch(err => console.log(err));
  // }

  // paymentDone(data) {
  //   console.log(data);
  //   if (!!this.premiumPaymentData && this.premiumPaymentData._id) {
  //     console.log('Payment Done');
  //     console.log(this.premiumPaymentData);
  //     let payload = {
  //       premiumPaymentId: this.premiumPaymentData._id,
  //       action: 'update',
  //       ref: data
  //     };
  //     console.log('Call API');
  //     // Call paystack verification API
  //     this._premiumPaymentService.payWidthCashWithMiddleWare(payload).then((verifyRes: any) => {
  //       console.log(verifyRes);
  //       if (!!verifyRes.body._id) {
  //         this._getUnbatchedPolicies();
  //         this.showPaystack = false;
  //         this.openBatchModal = false;
  //         this.premiumPaymentData = {};
  //         this.ngOnInit();
  //         // this._router.navigate(['/modules/premium-payment/previous']);
  //         this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
  //       }
  //     }).catch(err => {
  //       console.log(err);
  //     });
  //   }
  // }


  // onClickOpenBatchModal() {
  //   this.openBatchModal = true;
  // }

  // modal_close() {
  //   this.openBatchModal = false;
  // }

  // paymentCancel() {
  //   console.log('Payment Closed');
  // }

}
