import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
// import { Angular4PaystackModule } from 'angular4-paystack';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, paystackClientKey, PAYMENTTYPES, SPONSORSHIP, TABLE_LIMIT_PER_VIEW } from '../../../services/globals/config';
import { SystemModuleService, FacilityService, ClaimsPaymentService, PolicyService, PremiumPaymentService } from '../../../services/index';
import { Policy, OrganizationPolicy } from '../../../models/index';
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
  organisationPolicies: OrganizationPolicy[] = [];
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
  showPaystack: boolean = false;
  premiumPaymentData: any;
  sponsorship: any = SPONSORSHIP;

  totalEntries:number;
  OrganisationTotalEntries:number;
  individualShowLoadMore:any = true;
  organisationShowLoadMore:any = true;
  limit:number = TABLE_LIMIT_PER_VIEW;
  resetData:Boolean;
  index:number = 0;

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
    private _premiumPaymentService: PremiumPaymentService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('PREMIUM PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('Pending payments for both individuals and organizations');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();

    this.paymentGroup = this._fb.group({
      batchNo: ['', [<any>Validators.required]],
      paymentType: ['e-Payment', [<any>Validators.required]]
    });

    this.paymentGroup.controls['paymentType'].valueChanges.subscribe(value => {
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

  private _getIndividualPolicies() {
    const sponsorship = this.sponsorship.filter(e => e.name.toLowerCase() === 'self')[0].name;
    let policies = [];
    this._systemService.on();
    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        'sponsorshipId.name': sponsorship,
        isPaid: false,
        $limit: this.limit,
        $skip: this.index*this.limit,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      console.log(res);
      this.individualLoading = false;
      res.data.forEach(policy => {
        policy.dueDate = this.addDays(new Date(), policy.premiumPackageId.durationInDay);
        policies.push(policy);
      });
      //this.individualPolicies = policies;
      this.totalEntries = res.total;
      (this.resetData !== true) ? this.individualPolicies.push(...policies) : this.individualPolicies = policies;
      if(this.individualPolicies.length >= this.totalEntries){
        this.individualShowLoadMore = false;
      }
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  private _getOrganisationPolicies() {
    this._systemService.on();
    const sponsorship = this.sponsorship.filter(e => e.name.toLowerCase() === 'organization')[0].name;

    this._policyService.find({
      query: {
        'platformOwnerId._id': this.currentPlatform._id,
        'sponsorshipId.name': sponsorship,
        isPaid: false,
        $limit: this.limit,
        $skip: this.index*this.limit,
        $sort: { createdAt: -1 }
      }
    }).then((res: any) => {
      // console.log(res);
      this.organisationLoading = false;
      res.data.forEach(policy => {
        console.log(policy);
        let hasItem = this.organisationPolicies.filter(e => !!e.sponsor && (e.sponsor._id === policy.sponsor._id));

        let modelPolicy: OrganizationPolicy = <OrganizationPolicy>{};
        modelPolicy._id = policy._id;
        modelPolicy.provider = policy.providerId;
        modelPolicy.platformOwner = policy.platformOwnerId;
        modelPolicy.sponsor = policy.sponsor;
        modelPolicy.hia = policy.hiaId;

        if (hasItem.length === 0) {
          modelPolicy.noOfEmployees = 1;
          modelPolicy.totalCost = policy.premiumPackageId.amount;
          this.organisationPolicies.push(modelPolicy);
        } else {
          hasItem[0].totalCost += policy.premiumPackageId.amount;
          hasItem[0].noOfEmployees++;
        }
      });
      this.totalEntries = res.total;
      //(this.resetData !== true) ? this.organisationPolicies.push(...res.data) : this.organisationPolicies = res.data;
      if(this.organisationPolicies.length >= this.OrganisationTotalEntries){
        this.organisationShowLoadMore = false;
      }
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



  // onCheckSelectedToPay(index: number, policy: Policy) {
  //   console.log(policy);
  //   if (!policy.isChecked) {
  //     policy.isChecked = true;
  //     this.selectedOrganizationPolicies.push(policy);
  //   } else {
  //     policy.isChecked = false;
  //     this.selectedOrganizationPolicies = this.selectedOrganizationPolicies.filter(x => x._id !== policy._id);
  //     console.log(this.selectedOrganizationPolicies);
  //   }
  // }

  // onClickCreateAndPaybatch(valid: boolean, value: any) {
  //   this.paystackProcessing = true;
  //   console.log(value);
  //   let policies = [];
  //   // All policies that is being paid for.
  //   this.selectedOrganizationPolicies.forEach(policy => {
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
  //         this._getOrganisationPolicies();
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

  onClickTab(tabName: string) {
    if (tabName === 'individualPayment') {
      this.individualActiveTab = true;
      this.organisationActiveTab = false;
    } else {
      this.individualActiveTab = false;
      this.organisationActiveTab = true;
    }
  }

  // onClickOpenBatchModal() {
  //   this.openBatchModal = true;
  // }

  // modal_close() {
  //   this.openBatchModal = false;
  // }

  // paymentCancel() {
  //   console.log('Payment Closed');
  // }

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

  loadMore(){
    this._getCurrentPlatform();
  }

  reset(){
    this.index = 0;
    this.resetData = true;
    this._getCurrentPlatform();
    if(this.individualActiveTab) { this.individualShowLoadMore = true; this.organisationShowLoadMore = false; }
    else{ this.organisationShowLoadMore = true; this.individualShowLoadMore = false; }
  }

}
