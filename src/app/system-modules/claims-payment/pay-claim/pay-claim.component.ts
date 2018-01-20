import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, FLUTTERWAVE_PUBLIC_KEY } from './../../../services/globals/config';
import {
  SystemModuleService, UserTypeService, FacilityService, ClaimsPaymentService, ClaimService,
  BankService, ProviderRecipientService
} from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

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
  disableVerifyRecipient: boolean = false;
  disablePayRecipient: boolean = false;
  recipientCreated: boolean = false;
  loading: boolean = true;
  totalAmount: number = 0;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _bankService: BankService,
    private _locker: CoolLocalStorage,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _claimService: ClaimService,
    private _providerRecipientService: ProviderRecipientService
  ) {
    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        this.routeId = param.id;
      }
    });
  }

  ngOnInit() {
    console.log(this.claims);
    console.log(this.hiaDetails);
    if (this.claims.length > 0) {
      this.totalAmount = this.claims.reduce((acc, obj) => acc + obj.costingApprovalDocumentation, 0);
    }
    console.log(this.totalAmount);
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
        bankCode: this.selectedFacility.bankDetails.bank.name
      };

      this._providerRecipientService.verifyProviderAccount(payload).then(res => {
        console.log(res);
        this.disableVerifyRecipient = false;
        this.verifyingRecipient = false;
        this.verifyRecipient = true;
        this.recipientCreated = true;
      }).catch(err => {
        console.log(err);
      });
    } else {

    }
  }

  private onClickPayRecipient() {
    if (!!this.selectedFacility._id && !!this.currentPlatform._id) {
      this.disablePayRecipient = true;
      this.payRecipient = false;
      this.payingRecipient = true;
      const claimIds = this.claims.map(x => x._id);

      const payload = {
        platformOwnerId: this.currentPlatform._id,
        hiaId: this.hiaDetails._id,
        providerId: this.selectedFacility._id,
        accountNumber: this.selectedFacility.bankDetails.accountNumber,
        bankCode: this.selectedFacility.bankDetails.bank.name,
        claimIds: claimIds
      };

      this._providerRecipientService.payProviderAccount(payload).then(res => {
        console.log(res);
        this.disablePayRecipient = false;
        this.payRecipient = true;
        this.payingRecipient = false;
      }).catch(err => {
        console.log(err);
      });
    } else {

    }
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
