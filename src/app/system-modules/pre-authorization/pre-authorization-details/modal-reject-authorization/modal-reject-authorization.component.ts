import { SystemModuleService } from './../../../../services/common/system-module.service';
import { PreAuthorizationService } from './../../../../services/pre-authorization/pre-authorization.service';
import { PreAuthorizationDocument, Authorization } from './../../../../models/authorization/authorization';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FORM_VALIDATION_ERROR_MESSAGE, REQUEST_STATUS } from './../../../../services/globals/config';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reject-authorization',
  templateUrl: './modal-reject-authorization.component.html',
  styleUrls: ['./modal-reject-authorization.component.scss']
})
export class ModalRejectAuthorizationComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: Authorization;

  preAuthRejectFormGroup: FormGroup;
  approvedStatus = REQUEST_STATUS;

  constructor(private _pa: FormBuilder,
    private _toastr: ToastsManager,
    private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this.preAuthRejectFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', []]
    });
    console.log(this.selectedTransaction);
    console.log(this.selectedAuthorization)
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  ok() {
    this._systemService.on();
    if (this.preAuthRejectFormGroup.valid) {
      let response: any = {
        by: this.preAuthRejectFormGroup.controls.name.value,
        reason: this.preAuthRejectFormGroup.controls.reason.value
      }
      this.selectedTransaction.response = response;
      this.selectedTransaction.approvedStatus = this.approvedStatus[2];
      const index = this.selectedAuthorization.documentation.findIndex(x => x._id === this.selectedTransaction._id);
      this.selectedAuthorization.documentation[index] = this.selectedTransaction;

      this._preAuthorizationService.update(this.selectedAuthorization).then(payload => {
        console.log(payload);
        this._systemService.off();
      }).catch(err => {
        console.log(err)
        this._systemService.off();
      });

    } else {
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.preAuthRejectFormGroup.controls).forEach((field, i) => {
        const control = this.preAuthRejectFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
        }
      });
    }
  }

}
