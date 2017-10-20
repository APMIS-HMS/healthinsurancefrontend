import { REQUEST_STATUS, FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { PreAuthorizationDocument, Authorization } from './../../../../models/authorization/authorization';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { PreAuthorizationService } from './../../../../services/pre-authorization/pre-authorization.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-hold-authorization',
  templateUrl: './modal-hold-authorization.component.html',
  styleUrls: ['./modal-hold-authorization.component.scss']
})
export class ModalHoldAuthorizationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: Authorization;
  preAuthHoldFormGroup: FormGroup;
  approvedStatus = REQUEST_STATUS;
  constructor(private _pa: FormBuilder,
    private _toastr: ToastsManager,
    private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService) { }
 
  ngOnInit() {
    this.preAuthHoldFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', []]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  ok() {
    this._systemService.on();
    if (this.preAuthHoldFormGroup.valid) {
      let response: any = {
        by: this.preAuthHoldFormGroup.controls.name.value,
        reason: this.preAuthHoldFormGroup.controls.reason.value
      }
      this.selectedTransaction.response = response;
      this.selectedTransaction.approvedStatus = this.approvedStatus[4];
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
      Object.keys(this.preAuthHoldFormGroup.controls).forEach((field, i) => {
        const control = this.preAuthHoldFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
        }
      });
      this._systemService.off();
    }
  }
}

