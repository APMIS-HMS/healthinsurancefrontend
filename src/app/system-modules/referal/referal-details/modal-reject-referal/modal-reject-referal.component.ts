import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reject-referal',
  templateUrl: './modal-reject-referal.component.html',
  styleUrls: ['./modal-reject-referal.component.scss']
})
export class ModalRejectReferalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    ReferalRejectFormGroup: FormGroup;
  
    constructor(private _fb: FormBuilder) { }
  
    ngOnInit() {
      this.ReferalRejectFormGroup = this._fb.group({
        name: ['', [<any>Validators.required]],
        reason: ['', [<any>Validators.required]],
        institution: ['', [<any>Validators.required]]  
      });
    }
  
    modalClose_event() {
      this.closeModal.emit(true);
    }
  
  }
  