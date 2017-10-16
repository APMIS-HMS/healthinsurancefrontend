import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-approve-authorization',
  templateUrl: './modal-approve-authorization.component.html',
  styleUrls: ['./modal-approve-authorization.component.scss']
})
export class ModalApproveAuthorizationComponent implements OnInit {


  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  preAuthApproveFormGroup: FormGroup;

  constructor(private _pa: FormBuilder) { }
  ngOnInit() {
    this.preAuthApproveFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
