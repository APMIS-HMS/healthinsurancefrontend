import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-approve-claim',
  templateUrl: './modal-approve-claim.component.html',
  styleUrls: ['./modal-approve-claim.component.scss']
})
export class ModalApproveClaimComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  claimsApproveFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.claimsApproveFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]  
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
