import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Angular4PaystackModule } from 'angular4-paystack';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES } from '../../../services/globals/config';
import { SystemModuleService, FacilityService, ClaimsPaymentService, PolicyService } from '../../../services/index';
import { Policy } from '../../../models/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-pending-payments',
  templateUrl: './pending-payments.component.html',
  styleUrls: ['./pending-payments.component.scss']
})
export class PendingPaymentsComponent implements OnInit {
  paymentGroup: FormGroup;
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  employer = new FormControl();
  dateRange = new FormControl();
  individualActiveTab: boolean = true;
  organisationActiveTab: boolean = false;
  user: any;
  currentPlatform: any;
  openBatchModal: boolean = false;
  individualLoading: boolean = true;
  organisationLoading: boolean = true;
  individualPolicies: any = [];
  organisationPolicies: any = [];
  selectedOrganizationPolicies: any = [];
  paystackClientKey: string = paystackClientKey;
  withPaystack: boolean = true;
  cashPayment: boolean = false;
  chequePayment: boolean = false;
  paystackProcessing: boolean = false;
  refKey: number;
  paymentType: string = 'e-Payment';
  totalCost: number = 0;
  totalItem: number = 0;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _policyService: PolicyService,
    private _angular4PaystackModule: Angular4PaystackModule
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('PREMIUM PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('Pending payments for both individuals and organizations');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    this._getCurrentPlatform();

    this.paymentGroup = this._fb.group({
      batchName: ['', [<any>Validators.required]],
      paymentOption: ['e-Payment', [<any>Validators.required]]
    });

    this.paymentGroup.controls['paymentOption'].valueChanges.subscribe(value => {
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
    console.log(this.refKey)
  }

  private _getIndividualPolicies() {
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
      this.individualLoading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.individualPolicies.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getOrganisationPolicies() {
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
      this.organisationLoading = false;
      res.data.forEach(policy => {
        policy.isChecked = false;
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        this.organisationPolicies.push(policy);
      });
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString(); // .toISOString();
  }


  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getIndividualPolicies();
        this._getOrganisationPolicies();
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }


  onCheckAllToPay(isChecked) {
    console.log(isChecked);
    // if (!isChecked) {
      let counter = 0;
      this.organisationPolicies.forEach(policy => {
        console.log(policy);
        counter++;
        policy.isChecked = isChecked;
        console.log(policy.isChecked);
        if (policy.isChecked) {
          this.totalItem++;
          this.totalCost += policy.premiumPackageId.amount;
          this.selectedOrganizationPolicies.push(policy);
        } else {
          this.totalItem--;
          this.totalCost -= policy.premiumPackageId.amount;
        }
      });

      if ((counter === this.organisationPolicies.length) && !isChecked) {
          this.selectedOrganizationPolicies = [];
      }
      console.log(this.organisationPolicies);
      console.log(this.selectedOrganizationPolicies);
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
      this.selectedOrganizationPolicies.push(policy);
    } else {
      policy.isChecked = false;
      this.selectedOrganizationPolicies = this.selectedOrganizationPolicies.filter(x => x._id !== policy._id);
      console.log(this.selectedOrganizationPolicies);
    }
  }

  onClickCreateAndPaybatch() {
    this.paystackProcessing = true;
    this.onClickPaystack();
  }

  onClickPaystack() {
    console.log('awesome.');
     // this._angular4PaystackModule
  }

  onClickTab(tabName: string) {
    if (tabName === 'individualPayment') {
      this.individualActiveTab = true;
      this.organisationActiveTab = false;
    } else {
      this.individualActiveTab = false;
      this.organisationActiveTab = true;
    }
  }

  paymentDone(event) {
    console.log(event);
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

  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.off();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

}
