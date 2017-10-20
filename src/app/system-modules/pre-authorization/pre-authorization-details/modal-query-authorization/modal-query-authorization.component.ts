import { REQUEST_STATUS, FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { PreAuthorizationService } from './../../../../services/pre-authorization/pre-authorization.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PreAuthorizationDocument, Authorization } from './../../../../models/authorization/authorization';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-query-authorization',
  templateUrl: './modal-query-authorization.component.html',
  styleUrls: ['./modal-query-authorization.component.scss']
})
export class ModalQueryAuthorizationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: Authorization;

  preAuthQueryFormGroup: FormGroup;
  approvedStatus = REQUEST_STATUS;
  constructor(private _pa: FormBuilder,
    private _toastr: ToastsManager,
    private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService) { }

  ngOnInit() {
    this.preAuthQueryFormGroup = this._pa.group({
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
    if (this.preAuthQueryFormGroup.valid) {
      let response: any = {
        by: this.preAuthQueryFormGroup.controls.name.value,
        reason: this.preAuthQueryFormGroup.controls.reason.value
      }
      this.selectedTransaction.response = response;
      this.selectedTransaction.approvedStatus = this.approvedStatus[3];
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
      Object.keys(this.preAuthQueryFormGroup.controls).forEach((field, i) => {
        const control = this.preAuthQueryFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
        }
      });
      this._systemService.off();
    }
  }
  

}
