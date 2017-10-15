import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-hold-authorization',
  templateUrl: './modal-hold-authorization.component.html',
  styleUrls: ['./modal-hold-authorization.component.scss']
})
export class ModalHoldAuthorizationComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  preAuthHoldFormGroup: FormGroup;

  constructor(private _pa: FormBuilder) { }
 
  ngOnInit() {
    this.preAuthHoldFormGroup = this._pa.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}

