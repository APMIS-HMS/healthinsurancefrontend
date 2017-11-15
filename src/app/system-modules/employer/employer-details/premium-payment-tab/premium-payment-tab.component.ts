import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../../services/globals/config';
import {
  SystemModuleService, FacilityService, PolicyService, PremiumPaymentService
} from '../../../../services/index';
import { Policy } from '../../../../models/index';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-premium-payment-tab',
  templateUrl: './premium-payment-tab.component.html',
  styleUrls: ['./premium-payment-tab.component.scss']
})
export class PremiumPaymentTabComponent implements OnInit {
  // @Output() isDoneSavingPolicy: any;
  openBatchModal: boolean = false;
  paymentGroup: FormGroup;
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  user: any;
  employer = new FormControl();
  dateRange = new FormControl();
  showPaystack: boolean = false;
  withPaystack: boolean = true;
  cashPayment: boolean = false;
  chequePayment: boolean = false;
  paymentType: string = 'e-Payment';
  paystackClientKey: string = paystackClientKey;
  paystackProcessing: boolean = false;
  refKey: number;
  unbatchedActiveTab: boolean = true;
  batchedActiveTab: boolean = false;
  currentPlatform: any;
  selectedPolicies: any = <any>[];
  totalCost = 0;
  premiumPaymentData: any;
  facility: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
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
    this._headerEventEmitter.setRouteUrl('Organization Details');
    this._headerEventEmitter.setMinorRouteUrl('Premium Payment');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getFacility(param.id);
      }
    });

    this._getCurrentPlatform();

    this._premiumPaymentService.announcedPolicy.subscribe(policies => {
      console.log(policies);
      this.selectedPolicies = policies;
    });

    this.paymentGroup = this._fb.group({
      batchNo: ['', [<any>Validators.required]],
      paymentType: ['e-Payment', [<any>Validators.required]]
    });

    this.paymentGroup.controls['paymentType'].valueChanges.subscribe(value => {
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

    this.refKey = (this.user ? this.user._id.substr(20) : '') + new Date().getTime();
  }

  onClickCreateAndPaybatch(valid: boolean, value: any) {
    this.paystackProcessing = true;
    console.log(value);
    let policies = [];
    if (this.selectedPolicies.length > 0 && !!this.currentPlatform && !!this.currentPlatform._id) {
      // Get the total price
      this.selectedPolicies.forEach(policy => {
        this.totalCost += policy.premiumPackageId.amount;
      });
      // All policies that is being paid for.
      this.selectedPolicies.forEach(policy => {
        console.log(policy);
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
        sponsor: this.facility,
        // sponsorshipId: ,
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
    } else {
      console.log('Current platform owner or selected policies is empty');
    }
  }


  paymentDone(data) {
    console.log(data);
    if (!!this.premiumPaymentData && !!this.facility && this.premiumPaymentData._id && !!this.facility._id) {
      console.log('Payment Done');
      console.log(this.premiumPaymentData);
      let payload = {
        premiumPaymentId: this.premiumPaymentData._id,
        action: 'update',
        ref: data
      };

      // Call paystack verification API
      this._premiumPaymentService.payWidthCashWithMiddleWare(payload).then((verifyRes: any) => {
        console.log(verifyRes);
        if (!!verifyRes.body._id) {
          this.showPaystack = false;
          this.openBatchModal = false;
          this.premiumPaymentData = {};
          this.onClickTab('batchedPayment');
          this._premiumPaymentService.setWhenDone(true);
          this._toastr.success('Policy has been activated successfully.', 'Payment Completed!');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }


  onClickTab(tabName: string) {
    // Reset selected policies to an empty array.
    this.selectedPolicies = [];
    if (tabName === 'unbatchedPayment') {
      this.unbatchedActiveTab = true;
      this.batchedActiveTab = false;
    } else {
      this.unbatchedActiveTab = false;
      this.batchedActiveTab = true;
    }
  }

  private _getFacility(id) {
    this._facilityService.get(id, {}).then((res: any) => {
      if (!!res && res._id) {
        this.facility = {
          name: res.name,
          _id: res._id,
          email: res.email,
          logo: res.logo,
          phoneNumber: res.phoneNumber
        };
        console.log(this.facility);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find(
      { query: { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] }}
    ).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  onClickOpenBatchModal() {
    this.openBatchModal = true;
  }

  modal_close() {
    this.openBatchModal = false;
  }

  paymentCancel() {
    console.log('Payment Closed');
  }


}
