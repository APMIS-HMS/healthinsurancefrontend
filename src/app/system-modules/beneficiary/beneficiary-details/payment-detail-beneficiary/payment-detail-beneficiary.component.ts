import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../../services/globals/config';
import { FacilityService, SystemModuleService, BeneficiaryService, PolicyService, PremiumPaymentService } from '../../../../services/index';

@Component({
  selector: 'app-payment-detail-beneficiary',
  templateUrl: './payment-detail-beneficiary.component.html',
  styleUrls: ['./payment-detail-beneficiary.component.scss']
})
export class PaymentDetailBeneficiaryComponent implements OnInit {
  paymentOptionGroup: FormGroup;
  policy: any;
  previousPolicies: any = [];
  currentPlatform: any;
  user: any;
  paystackClientKey: string = paystackClientKey;
  withPaystack: boolean = true;
  cashPayment: boolean = false;
  chequePayment: boolean = false;
  refKey: number;
  paymentType: string = 'e-Payment';
  previousPolicyLoading: boolean = true;
  showPayment: boolean = false;
  paymentTypes: any = PAYMENTTYPES;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _policyService: PolicyService,
    private _premiumPaymentService: PremiumPaymentService
  ) {

  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;

    this._route.parent.params.subscribe(param => {
      if (!!param.id) {
        this._getPolicyDetails(param.id);
        this._getPreviousPolicies(param.id);
        this._getCurrentPlatform();
      }
    });

    this.paymentOptionGroup = this._fb.group({
      paymentOption: ['e-Payment', [<any>Validators.required]]
    });

    this.paymentOptionGroup.controls['paymentOption'].valueChanges.subscribe(value => {
      console.log(value);
      this.paymentType = value;
      if (value === 'Cash' || value === 'Cheque') {
        this.cashPayment = true;
        this.chequePayment = true;
        this.withPaystack = false;
      } else {
        this.withPaystack = true;
        this.cashPayment = false;
        this.chequePayment = false;
      }
    });

    this.refKey = parseFloat((this.user ? this.user._id.substr(20) : ''))  * new Date().getTime();
  }

  private _getPolicyDetails(routeId) {
    this._policyService.find({ query: { 'principalBeneficiary._id': routeId } }).then((res: any) => {
      if (res.data.length > 0) {
        res.data[0].premiumPackageId.amountInKobo = res.data[0].premiumPackageId.amount * 100;
        res.data[0].dueDate = this.addDays(new Date(), res.data[0].premiumPackageId.durationInDay);
        this.policy = res.data[0];
        console.log(this.policy);
      }
    }).catch(err => console.log(err));
  }

  private _getPreviousPolicies(routeId) {
    this._policyService.find({
      query: { 'principalBeneficiary._id': routeId, isPaid: true, $sort: { createdAt: -1 } }
    }).then((res: any) => {
      this.previousPolicyLoading = false;
      if (res.data.length > 0) {
        console.log(res.data);
        res.data.forEach(policy => {
          policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
          this.previousPolicies.push(policy);
        });
        // this.previousPolicies = res.data;
      }
    }).catch(err => console.log(err));
  }

  private _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }).catch(err => {
      console.log(err);
      this._router.navigate(['auth/login']);
    });
  }

  paymentDone(data) {
    console.log(data);
    let policies = [];
    // All policies that is being paid for.
    policies.push({
      policyId: this.policy.policyId,
      policyCollectionId: this.policy._id
    });

    let ref = {
      platformOwnerId: this.currentPlatform,
      reference: data,
      policies: policies,
      paidBy: this.user,
      requestedAmount: this.policy.premiumPackageId.amount,
      amountPaid: this.policy.premiumPackageId.amount,
      paymentType: this.paymentType
    };
    // Save into the Premium Payment Service
    this._premiumPaymentService.create(ref).then((res: any) => {
      console.log(res);
      

      let verificationData = {
        reference: res.reference,
        premiumId: res._id
      };
      // Call paystack verification API
      this._premiumPaymentService.verifyPaystackWithMiddleWare(verificationData).then((verifyRes: any) => {
        console.log(verifyRes);
        if (!!verifyRes) {
          this.showPayment = false;
          this._getPolicyDetails(res._id);
          this._getPreviousPolicies(res._id);
          this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
        }
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }

  onClickShowPayment() {
    this.showPayment = !this.showPayment;
  }

  // onChangePaymentType(value: string) {
  //   console.log(value);
  //   this.paymentType = value;
  //   if (value === 'Cash' || value === 'Cheque') {
  //     this.cashPayment = true;
  //     this.chequePayment = true;
  //     this.withPaystack = false;
  //   } else {
  //     this.withPaystack = true;
  //     this.cashPayment = false;
  //     this.chequePayment = false;
  //   }
  // }

  paymentCancel() {
    console.log('Close');
  }

}
