import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
// import { Angular4PaystackComponent } from 'angular4-paystack';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';
import {
  FacilityService, SystemModuleService, BeneficiaryService, PolicyService, PremiumPaymentService
} from '../../../../services/index';

@Component({
  selector: 'app-payment-detail-beneficiary',
  templateUrl: './payment-detail-beneficiary.component.html',
  styleUrls: ['./payment-detail-beneficiary.component.scss']
})
export class PaymentDetailBeneficiaryComponent implements OnInit {
  paymentOptionGroup: FormGroup;
  cashPaymentGroup: FormGroup;
  policy: any;
  routeId: string;
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
  isForRenewal: boolean = false;
  openCashPaymentModal: boolean = false;
  cashPaymentProcessing: boolean = false;
  paymentTypes: any = PAYMENTTYPES;
  payment: string = 'flutterwave'; // This is either flutterwave or paystack

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _elementRef: ElementRef,
    // private _angular4Paystack: Angular4PaystackComponent,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _policyService: PolicyService,
    private _premiumPaymentService: PremiumPaymentService
  ) {

  }

  // ngAfterViewInit() {
  //   let s = document.createElement('script');
  //   s.type = 'text/javascript';
  //   s.src = 'http://flw-pms-dev.eu-west-1.elasticbeanstalk.com/flwv3-pug/getpaidx/api/flwpbf-inline.js';
  //   this._elementRef.nativeElement.appendChild(s);
  // }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary Payment');
    this._headerEventEmitter.setMinorRouteUrl('Payment and payment history for beneficiary');
    this.user = (<any>this._locker.getObject('auth')).user;

    this._route.parent.params.subscribe(param => {
      if (!!param.id) {
        this.routeId = param.id;
        this._getPolicyDetails(param.id);
        this._getCurrentPlatform();
      }
    });

    this.paymentOptionGroup = this._fb.group({
      paymentOption: ['e-Payment', [<any>Validators.required]]
    });

    this.cashPaymentGroup = this._fb.group({
      amount: [{ value: 0, disabled: true}, [<any>Validators.required]],
      comment: ['']
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

    this.refKey = (this.user ? this.user._id.substr(20) : '')  + new Date().getTime();
  }

  private _getPolicyDetails(routeId) {
    this._policyService.get(routeId, {}).then((res: any) => {
      console.log(res);
      if (res._id) {
        res.premiumPackageId.amountInKobo = res.premiumPackageId.amount * 100;
        res.dueDate = this.addDays(new Date(), res.premiumPackageId.durationInDay);
        this.isForRenewal = res.isPaid;
        this.policy = res;
      }
    }).catch(err => console.log(err));
  }

  private _getPreviousPolicies(routeId, ownerId: any) {
    this._policyService.find({
      query: {
        'platformOwnerId._id': ownerId,
        '_id': routeId,
        isPaid: true, $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      console.log(res);
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
    this._facilityService.find(
      { query: { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] } }
    ).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getPreviousPolicies(this.routeId, this.currentPlatform._id);
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

    let flutterwaveRes = {
      data: data.data.data,
      tx:  {
        charged_amount: data.tx.charged_amount,
        customer: data.tx.customer,
        flwRef: data.tx.flwRef,
        txRef: data.tx.txRef,
        orderRef: data.tx.orderRef,
        paymentType: data.tx.paymentType,
        raveRef: data.tx.raveRef,
        status: data.tx.status
      }
    };

    console.log(flutterwaveRes);
    let ref = {
      platformOwnerId: this.currentPlatform,
      reference: (this.payment === 'flutterwave') ? flutterwaveRes : data,
      policies: policies,
      sponsor: (!!this.policy.sponsor) ? this.policy.sponsor : 'self',
      paidBy: this.user,
      requestedAmount: this.policy.premiumPackageId.amount,
      amountPaid: this.policy.premiumPackageId.amount,
      paymentType: this.paymentType
    };

    if (this.payment === 'flutterwave') {
      if (data.tx.chargeResponse === '00' || data.tx.chargeResponse === '0') {
        // redirect to a success page
        console.log('Succeeded');
      } else {
        // Pending, Validation.
        ref.reference = flutterwaveRes.tx;
        this.createPremium(ref);
      }
    } else {
      // payment is paystack
      ref.reference = data;
      this.createPremium(ref);
    }
  }

  onClickCreateAndPaybatch(valid: boolean, value: any) {
    if (valid) {
      console.log(value);
      this.cashPaymentProcessing = true;
      let policies = [];

      // All policies that is being paid for.
      policies.push({
        policyId: this.policy.policyId,
        policyCollectionId: this.policy._id
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
        requestedAmount: this.policy.premiumPackageId.amount,
        amountPaid: this.policy.premiumPackageId.amount,
        paymentType: this.paymentType,
        sponsor: (!!this.policy.sponsor) ? this.policy.sponsor : 'self',
        comment: value.comment,
        isActive: true,
        action: 'create'
      };

      console.log(ref);
      this._premiumPaymentService.payWidthCashWithMiddleWare(ref).then((res: any) => {
        console.log(res);
        if (!!res) {
          this.showPayment = false;
          this.isForRenewal = true;
          this.openCashPaymentModal = false;
          this._getPolicyDetails(res.body._id);
          this._getPreviousPolicies(this.routeId, this.currentPlatform._id);
          this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
        }
      }).catch(err => {
        console.log(err);
      });
    } else {
      this._toastr.error('Please fill in all required fields', 'Form ValidationError!');
    }
  }

  createPremium(ref) {
    // Save into the Premium Payment Service
    this._premiumPaymentService.create(ref).then((res: any) => {
      console.log(res);

      let verificationData = {
        reference: res.reference,
        premiumId: res._id,
        payment: this.payment // flutterwave or paystack
      };
      // Call paystack verification API
      this._premiumPaymentService.verifyPaymentWithMiddleWare(verificationData).then((verifyRes: any) => {
        console.log(verifyRes);
        if (!!verifyRes) {
          if (verifyRes.body.status === 'success') {
            this.showPayment = false;
            this.isForRenewal = true;
            this._getPolicyDetails(verifyRes.body.data._id);
            this._getPreviousPolicies(this.routeId, this.currentPlatform._id);
            this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
          } else {
            this.showPayment = false;
            this.isForRenewal = true;
            this._toastr.error(verifyRes.body.message, 'Payment Error!');
          }
        }
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  onClickPayCash() {
    this.cashPaymentGroup.controls['amount'].setValue(this.policy.premiumPackageId.amount);
    this.openCashPaymentModal = true;
    console.log('Pay Cash');
  }

  modal_close() {
    this.openCashPaymentModal = false;
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }

  onClickShowPayment() {
    this.showPayment = !this.showPayment;
  }

  onClickRenewPremium() {
    this.isForRenewal = !this.isForRenewal;
  }

  paymentCancel() {
    console.log('Close');
  }

}
