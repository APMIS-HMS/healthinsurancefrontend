import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-batched',
  templateUrl: './batched.component.html',
  styleUrls: ['./batched.component.scss']
})
export class BatchedComponent implements OnInit {
  user: any;
  loading: boolean = true;
  policies: any = <any>[];
  selectedPolicies: any = <any>[];
  paystackClientKey: string = paystackClientKey;
  withPaystack: boolean = true;
  cashPayment: boolean = false;
  chequePayment: boolean = false;
  paystackProcessing: boolean = false;
  refKey: number;
  totalCost: number = 0;
  totalItem: number = 0;
  premiumPaymentData: any;
  currentPlatform: any;
  showPaystack: boolean = false;

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
  }

  onCheckAllToPay(isChecked) {
    console.log(isChecked);
    // if (!isChecked) {
    let counter = 0;
    this.policies.forEach(policy => {
      console.log(policy);
      counter++;
      policy.isChecked = isChecked;
      console.log(policy.isChecked);
      if (policy.isChecked) {
        this.totalItem++;
        this.totalCost += policy.premiumPackageId.amount;
        this.selectedPolicies.push(policy);
      } else {
        this.totalItem--;
        this.totalCost -= policy.premiumPackageId.amount;
      }
    });

    if ((counter === this.policies.length) && !isChecked) {
      this.selectedPolicies = [];
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
  }

  onClickCreateAndPaybatch(valid: boolean, value: any) {
    this.paystackProcessing = true;
    console.log(value);
    let policies = [];
    // All policies that is being paid for.
    this.selectedPolicies.forEach(policy => {
      if (policy.isChecked) {
        policies.push({
          policyId: policy.policyId,
          policyCollectionId: policy._id
        });
      }
    });

    let user = {
      userType: this.user.userType,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      facilityId: this.user.facilityId,
      email: this.user.email,
      isActive: this.user.isActive,
      platformOwnerId: (!!this.user.platformOwnerId) ? this.user.platformOwnerId : '',
      phoneNumber: this.user.phoneNumber
    };

    let ref = {
      platformOwnerId: this.currentPlatform,
      policies: policies,
      paidBy: user,
      requestedAmount: this.totalCost,
      amountPaid: 0,
      paymentType: value.paymentType,
      batchNo: value.batchNo
    };

    console.log(ref);
    // Create batch, if successful, enable the paystack button.
    this._premiumPaymentService.create(ref).then((res: any) => {
      if (!!res._id) {
        this.showPaystack = true;
        this.premiumPaymentData = res;
        console.log(res);
      }
    }).catch(err => console.log(err));
  }

  paymentDone(data) {
    console.log(data);
    if (!!this.premiumPaymentData && this.premiumPaymentData._id) {
      console.log('Payment Done');
      console.log(this.premiumPaymentData);
      let payload = {
        premiumPaymentId: this.premiumPaymentData._id,
        action: 'update',
        ref: data
      };
      console.log('Call API');
      // Call paystack verification API
      this._premiumPaymentService.payWidthCashWithMiddleWare(payload).then((verifyRes: any) => {
        console.log(verifyRes);
        if (!!verifyRes.body._id) {
          this._getBatchedPolicies();
          this.showPaystack = false;
          this.premiumPaymentData = {};
          this.ngOnInit();
          // this._router.navigate(['/modules/premium-payment/previous']);
          this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  private _getBatchedPolicies() {
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
        policy.isChecked = false;
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
        this._getBatchedPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }

}
