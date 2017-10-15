import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reject-authorization',
  templateUrl: './modal-reject-authorization.component.html',
  styleUrls: ['./modal-reject-authorization.component.scss']
})
export class ModalRejectAuthorizationComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  preAuthRejectFormGroup: FormGroup;

  constructor(private _pa: FormBuilder) { }

  ngOnInit() {
    this.preAuthRejectFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
