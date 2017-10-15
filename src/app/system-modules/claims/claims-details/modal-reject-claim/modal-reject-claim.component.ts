import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reject-claim',
  templateUrl: './modal-reject-claim.component.html',
  styleUrls: ['./modal-reject-claim.component.scss']
})
export class ModalRejectClaimComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    claimsRejectFormGroup: FormGroup;
  
    constructor(private _fb: FormBuilder) { }
  
    ngOnInit() {
      this.claimsRejectFormGroup = this._fb.group({
        name: ['', [<any>Validators.required]],
        reason: ['', [<any>Validators.required]],
        institution: ['', [<any>Validators.required]]  
      });
    }
  
    modalClose_event() {
      this.closeModal.emit(true);
    }
  
  }
  