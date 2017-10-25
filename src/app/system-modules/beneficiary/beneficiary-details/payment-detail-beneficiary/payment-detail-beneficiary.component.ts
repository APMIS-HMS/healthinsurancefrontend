import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from '../../../../services/globals/config';
import { FacilityService, SystemModuleService, BeneficiaryService, PolicyService, PremiumPaymentService } from '../../../../services/index';

@Component({
  selector: 'app-payment-detail-beneficiary',
  templateUrl: './payment-detail-beneficiary.component.html',
  styleUrls: ['./payment-detail-beneficiary.component.scss']
})
export class PaymentDetailBeneficiaryComponent implements OnInit {
  policy: any;
  previousPolicies: any = [];
  currentPlatform: any;
  user: any;
  withPaystack: boolean = false;
  previousPolicyLoading: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _policyService: PolicyService,
    private _premiumPaymentService: PremiumPaymentService
  ) {

  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._route.params.subscribe(param => {
      if (!!param.id) {
        this._getPolicyDetails(param.id);
        this._getPreviousPolicies(param.id);
        this._getCurrentPlatform();
      }
    });
  }

  private _getPolicyDetails(routeId) {
    this._policyService.find({ query: { 'principalBeneficiary._id': routeId } }).then((res: any) => {
      if (res.data.length > 0) {
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
        this.previousPolicies = res.data[0];
        console.log(this.policy);
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
    let ref = {
      platformOwnerId: this.currentPlatform,
      reference: data,
      policy: this.policy,
      paidBy: this.user,
      requestedAmount: 500000,
      amountPaid: 500000
    };
    // Save into the Premium Payment Service
    this._premiumPaymentService.create(ref).then((res: any) => {
      console.log(res);
      let verificationData = {
        reference: res.reference,
        premiumPolicyId: res._id
      };
      // Call paystack verification API
      this._premiumPaymentService.verifyPaystackWithMiddleWare(verificationData).then((verifyRes: any) => {
        console.log(verifyRes);
        if (!!verifyRes) {
          this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
        }
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  onChangePaymentType(value: String) {
    console.log(value);
  }

  paymentCancel() {
    console.log('Close');
  }

}
