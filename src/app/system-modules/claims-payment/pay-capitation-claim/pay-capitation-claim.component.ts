import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, FLUTTERWAVE_PUBLIC_KEY } from './../../../services/globals/config';
import {
  SystemModuleService, UserTypeService, FacilityService, ClaimsPaymentService, ClaimService,
  BankService, ProviderRecipientService, CapitationFeeService
} from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-pay-capitation-claim',
  templateUrl: './pay-capitation-claim.component.html',
  styleUrls: ['./pay-capitation-claim.component.scss']
})
export class PayCapitationClaimComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedUser;
  // @Input() hiaDetails;
  @Input() capitations;
  routeId: string;
  selectedFacility: any = <any>{};
  currentPlatform: any = <any>{};
  banks: any = <any>[];
  verifyRecipient: boolean = true;
  verifyingRecipient: boolean = false;
  payRecipient: boolean = true;
  payingRecipient: boolean = false;
  confirmRecipient: boolean = true;
  confirmingRecipient: boolean = false;
  disableVerifyRecipient: boolean = false;
  disablePayRecipient: boolean = false;
  disableConfirmRecipient: boolean = false;
  recipientCreated: boolean = false;
  loading: boolean = true;
  confirmedPayment: boolean = false;
  totalAmount: number = 0;
  user: any;
  capitationPrice: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _bankService: BankService,
    private _locker: CoolLocalStorage,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _claimService: ClaimService,
    private _providerRecipientService: ProviderRecipientService,
    private _capitationFeeService: CapitationFeeService
  ) {
    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        this.routeId = param.id;
      }
    });
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.capitations);
    console.log(this.selectedFacility);
    // console.log(this.hiaDetails);
    console.log(this.user);

    if (this.capitations.length > 0) {
      // this.totalAmount = this.capitations.reduce((acc, obj) => acc + obj.costingApprovalDocumentation, 0);
    }
    // console.log(this.totalAmount);
    this._getFacility();
    this._getCurrentPlatform();
  }

  private onClickVerifyRecipient() {
    if (!!this.selectedFacility._id && !!this.currentPlatform._id) {
      this.disableVerifyRecipient = true;
      this.verifyRecipient = false;
      this.verifyingRecipient = true;

      const payload = {
        platformOwnerId: this.currentPlatform._id,
        // hiaId: this.hiaDetails._id,
        providerId: this.selectedFacility._id,
        accountNumber: this.selectedFacility.bankDetails.accountNumber,
        bankCode: this.selectedFacility.bankDetails.bank.name
      };

      this._providerRecipientService.verifyProviderAccount(payload).then(res => {
        console.log(res);
        if (res.status === 'success') {
          this.disableVerifyRecipient = false;
          this.verifyingRecipient = false;
          this.verifyRecipient = true;
          this.recipientCreated = true;
        } else {
          this.disableVerifyRecipient = false;
          this.verifyingRecipient = false;
          this.verifyRecipient = true;
          this._toastr.error('Account details is invalid! Please provide a valid account details', 'Error!');
        }
      }).catch(err => {
        console.log(err);
      });
    } else {

    }
  }

  private onClickPayRecipient() {
    if (!!this.user.userType && (this.user.userType.name === 'Platform Owner' || this.user.userType.name === 'Health Insurance Agent')) {
      if (!!this.selectedFacility._id && !!this.currentPlatform._id) {
        this.disablePayRecipient = true;
        this.payRecipient = false;
        this.payingRecipient = true;
        const policies = this.capitations.map(x => x._id);
        // Remove unwanted data.
        const provider = {
          _id: this.selectedFacility._id,
          name: this.selectedFacility.name,
          provider: {
            providerId: this.selectedFacility.provider.providerId
          }
        };
        delete this.user.roles;

        const payload = <any> {
          platformOwnerId: this.currentPlatform,
          providerId: provider,
          policies: policies,
          amount: this.capitationPrice.amount * policies.length,
          claimType: 'Capitation',
          paidBy: this.user,
          paidByType: this.user.userType
        };

        if (this.user.userType.name === 'Health Insurance Agent') {
          payload.hiaId = this.user.facilityId;
        }

        this._providerRecipientService.payCapitationClaim(payload).then(res => {
          console.log(res);
          if (res.status === 'success') {
            this.disablePayRecipient = false;
            this.payRecipient = true;
            this.payingRecipient = false;
            this.confirmedPayment = true;
            const amount = this.capitationPrice.amount;
            const text = `You successfully paid ${this.selectedFacility.name} the sum of ${amount} for ${policies.length} claims.`;
            this._toastr.success(text, 'Success!');
            this._toastr.info('Redirecting...', 'Redirecting!');
            setTimeout(() => {
              this._router.navigate(['/modules/claims/paid-claims']);
            }, 2000);
          } else {
            this._toastr.error(res.message, 'Error!');
            this.onClickCloseModal();
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        this._toastr.error('Please try again', 'Error!');
      }
    } else {
      this._toastr.error('You can not perform this action', 'Error!');
    }
  }

  private _getClaimsCapitationPrice(id: string) {
    this._systemService.on();
    this._capitationFeeService.find({
      query: {
        'platformOwnerId._id': id,
        isActive: true
      }
    }).then((res: any) => {
      console.log(res);
      this.capitationPrice = res.data[0];
      this._getProviderRecipient();
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
        this.currentPlatform = res.data[0];
        this._getClaimsCapitationPrice(this.currentPlatform._id);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private _getHia() {
    this._facilityService.find({
      query: {
        shortName: CurrentPlaformShortName,
        $select: ['name', 'shortName', 'address.state']
      }
    }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getClaimsCapitationPrice(this.currentPlatform._id);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private _getProviderRecipient() {
    this._providerRecipientService.find({
      query: {
        platformOwnerId: this.currentPlatform._id,
        providerId: this.routeId,
        // hiaId: this.hiaDetails._id,
        isRecipientConfirmed: true
      }
    }).then((res: any) => {
      console.log(res);
      this.loading = false;
      if (res.data.length > 0) {
        this.recipientCreated = true;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private _getFacility() {
    this._systemService.on();
    this._facilityService.get(this.routeId, {}).then((res: any) => {
      console.log(res);
      if (!!res._id) {
        this.selectedFacility = res;
      }
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    });
  }

  onClickCloseModal() {
    this.closeModal.emit(true);
  }
}
