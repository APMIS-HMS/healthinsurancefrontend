import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-hold-claim',
  templateUrl: './modal-hold-claim.component.html',
  styleUrls: ['./modal-hold-claim.component.scss']
})
export class ModalHoldClaimComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  claimsHoldFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.claimsHoldFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]  
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
  