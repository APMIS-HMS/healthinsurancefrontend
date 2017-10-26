import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Authorization, PreAuthorizationDocument } from './../../../../models/authorization/authorization';
import { ReferralAuthorization } from './../../../../models/referral/referral';
import { ReferralService } from './../../../../services/referral/referral.service';
import { FORM_VALIDATION_ERROR_MESSAGE, REQUEST_STATUS } from './../../../../services/globals/config';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SystemModuleService } from '../../../../services/index';

@Component({
  selector: 'app-modal-approve-referal',
  templateUrl: './modal-approve-referal.component.html',
  styleUrls: ['./modal-approve-referal.component.scss']
})
export class ModalApproveReferalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: Authorization;

  approvedStatus = REQUEST_STATUS;
  ReferalApproveFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _preAuthorizationService: ReferralService,
    private _systemService: SystemModuleService) { }

  ngOnInit() {
    this.ReferalApproveFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  ok() {
    this._systemService.on();
    if (this.ReferalApproveFormGroup.valid) {
      let response: any = {
        by: this.ReferalApproveFormGroup.controls.name.value,
        reason: this.ReferalApproveFormGroup.controls.reason.value
      }
      this.selectedTransaction.response = response;
      this.selectedTransaction.approvedStatus = this.approvedStatus[1];
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
      Object.keys(this.ReferalApproveFormGroup.controls).forEach((field, i) => {
        const control = this.ReferalApproveFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
        }
      });
      this._systemService.off();
    }
  }

}
