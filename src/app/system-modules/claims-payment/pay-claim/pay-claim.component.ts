import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable, Subscription} from 'rxjs/Rx';

import {environment} from '../../../../environments/environment';
import {BankService, ClaimService, ClaimsPaymentService, FacilityService, ProviderRecipientService, SystemModuleService, UserTypeService} from '../../../services/index';

import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-pay-claim',
  templateUrl: './pay-claim.component.html',
  styleUrls: ['./pay-claim.component.scss']
})
export class PayClaimComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedUser;
  @Input() hiaDetails;
  @Input() claims;
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
  platformName: string;

  constructor(
      private _router: Router, private _route: ActivatedRoute,
      private _toastr: ToastsManager, private _bankService: BankService,
      private _locker: CoolLocalStorage,
      private _systemService: SystemModuleService,
      private _facilityService: FacilityService,
      private _claimService: ClaimService,
      private _providerRecipientService: ProviderRecipientService) {
    this.platformName = environment.platform;
    this._route.params.subscribe(param => {
      if (!!param.id) {
        this.routeId = param.id;
      }
    });
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;

    if (this.claims.length > 0) {
      this.totalAmount = this.claims.reduce(
          (acc, obj) => acc + obj.costingApprovalDocumentation, 0);
    }
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
        hiaId: this.hiaDetails._id,
        providerId: this.selectedFacility._id,
        accountNumber: this.selectedFacility.bankDetails.accountNumber,
        bankCode: this.selectedFacility.bankDetails.bank.code
      };

      console.log(payload);
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
    if (!!this.user.userType && (this.user.userType.name === 'Platform Owner' ||
         this.user.userType.name === 'Health Insurance Agent')) {
      if (!!this.selectedFacility._id && !!this.currentPlatform._id) {
        this.disablePayRecipient = true;
        this.payRecipient = false;
        this.payingRecipient = true;
        const claimIds = this.claims.map(x => x._id);
        // Remove unwanted data.
        const provider = {
          _id: this.selectedFacility._id,
          name: this.selectedFacility.name,
          provider: {providerId: this.selectedFacility.provider.providerId}
        };
        delete this.hiaDetails.hia.validityPeriods;
        delete this.user.roles;

        const payload = {
          platformOwnerId: this.currentPlatform,
          hiaId: this.hiaDetails,
          providerId: provider,
          claimIds: claimIds,
          amount: this.totalAmount,
          claimType: 'Fee for service',
          paidBy: this.user,
          paidByType: this.user.userType
        };

        this._providerRecipientService.payProviderAccount(payload).then(res => {
          console.log(res);
          if (res.status === 'success') {
            this.disablePayRecipient = false;
            this.payRecipient = true;
            this.payingRecipient = false;
            this.confirmedPayment = true;
            const text = `You successfully paid ${this.selectedFacility.name} the sum of ${this.totalAmount} for ${claimIds.length} claims.`;
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


  // private onClickConfirmRecipient() {
  //   if (!!this.user.userType && (this.user.userType.name === 'Platform Owner'
  //   || this.user.userType.name === 'Health Insurance Agent')) {
  //     if (!!this.selectedFacility._id && !!this.currentPlatform._id) {
  //       const otp = this.otp.value;
  //       this.disablePayRecipient = true;
  //       this.payRecipient = false;
  //       this.payingRecipient = true;
  //       const claimIds = this.claims.map(x => x._id);

  //       const payload = {
  //         platformOwnerId: this.currentPlatform._id,
  //         hiaId: this.hiaDetails._id,
  //         providerId: this.selectedFacility._id,
  //         claimIds: claimIds,
  //         otp: otp,
  //         paidBy: this.user._id,
  //         paidByType: this.user.userType.name
  //       };

  //       this._providerRecipientService.confirmProviderAccount(payload).then(res
  //       => {
  //         console.log(res);
  //         this.disableConfirmRecipient = false;
  //         this.confirmedPayment = true;
  //         this.confirmRecipient = false;
  //         this.confirmingRecipient = false;
  //       }).catch(err => {
  //         console.log(err);
  //       });
  //     } else {

  //     }
  //   } else {

  //   }
  // }

  private _getCurrentPlatform() {
    this._facilityService.find({
      query: {
        shortName: this.platformName,
        $select: ['name', 'shortName', 'address.state']
      }
    }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getProviderRecipient();
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
        hiaId: this.hiaDetails._id,
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
      if (!!res._id) {
        console.log(res);
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
