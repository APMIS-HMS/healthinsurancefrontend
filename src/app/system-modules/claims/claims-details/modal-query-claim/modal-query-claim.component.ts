import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-query-claim',
  templateUrl: './modal-query-claim.component.html',
  styleUrls: ['./modal-query-claim.component.scss']
})
export class ModalQueryClaimComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  claimsQueryFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.claimsQueryFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]  
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
  