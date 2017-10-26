import { REQUEST_STATUS, FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ReferralService } from './../../../../services/referral/referral.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ReferralAuthorization } from './../../../../models/referral/referral';
import { PreAuthorizationDocument } from './../../../../models/authorization/authorization';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reject-referal',
  templateUrl: './modal-reject-referal.component.html',
  styleUrls: ['./modal-reject-referal.component.scss']
})
export class ModalRejectReferalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: ReferralAuthorization;

  user: any;
  approvedStatus = REQUEST_STATUS;
  ReferalRejectFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _preAuthorizationService: ReferralService,
    private _locker: CoolLocalStorage,
    private _systemService: SystemModuleService) { }

  ngOnInit() {
    this.ReferalRejectFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', []]
    });
    this.user = (<any>this._locker.getObject('auth')).user
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  ok() {
    if (this.user.userType.name === 'Health Insurance Agent') {
      this._systemService.on();
      if (this.ReferalRejectFormGroup.valid) {
        let response: any = {
          by: this.ReferalRejectFormGroup.controls.name.value,
          reason: this.ReferalRejectFormGroup.controls.reason.value,
          approvedStatus: this.approvedStatus[2]
        }
        this.selectedAuthorization.hiaApproved = response

        this._preAuthorizationService.update(this.selectedAuthorization).then(payload => {
          console.log(payload);
          this._systemService.off();
          this.modalClose_event();
        }).catch(err => {
          console.log(err)
          this._systemService.off();
        });

      } else {
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        Object.keys(this.ReferalRejectFormGroup.controls).forEach((field, i) => {
          const control = this.ReferalRejectFormGroup.get(field);
          if (!control.valid) {
            control.markAsDirty({ onlySelf: true });
          }
        });
        this._systemService.off();
      }
    } else if (this.user.userType.name === 'Provider') {
      this._systemService.on();
      if (this.ReferalRejectFormGroup.valid) {
        let response: any = {
          by: this.ReferalRejectFormGroup.controls.name.value,
          reason: this.ReferalRejectFormGroup.controls.reason.value,
          approvedStatus: this.approvedStatus[2]
        }
        this.selectedTransaction.response = response;
        this.selectedTransaction.approvedStatus = this.approvedStatus[2];
        this.selectedAuthorization.destinationProvider = this.user.facilityId;
        const index = this.selectedAuthorization.documentation.findIndex(x => x._id === this.selectedTransaction._id);
        this.selectedAuthorization.documentation[index] = this.selectedTransaction;

        this._preAuthorizationService.update(this.selectedAuthorization).then(payload => {
          console.log(payload);
          this._systemService.off();
          this.modalClose_event();
        }).catch(err => {
          console.log(err)
          this._systemService.off();
        });

      } else {
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        Object.keys(this.ReferalRejectFormGroup.controls).forEach((field, i) => {
          const control = this.ReferalRejectFormGroup.get(field);
          if (!control.valid) {
            control.markAsDirty({ onlySelf: true });
          }
        });
        this._systemService.off();
      }
    }

  }

}
