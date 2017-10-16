import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-query-authorization',
  templateUrl: './modal-query-authorization.component.html',
  styleUrls: ['./modal-query-authorization.component.scss']
})
export class ModalQueryAuthorizationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  preAuthQueryFormGroup: FormGroup;

  constructor(private _pa: FormBuilder) { }

  ngOnInit() {
    this.preAuthQueryFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
