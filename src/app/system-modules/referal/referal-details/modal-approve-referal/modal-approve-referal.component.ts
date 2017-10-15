import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-approve-referal',
  templateUrl: './modal-approve-referal.component.html',
  styleUrls: ['./modal-approve-referal.component.scss']
})
export class ModalApproveReferalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    ReferalApproveFormGroup: FormGroup;
  
    constructor(private _fb: FormBuilder) { }
  
    ngOnInit() {
      this.ReferalApproveFormGroup = this._fb.group({
        name: ['', [<any>Validators.required]],
        reason: ['', [<any>Validators.required]],
        institution: ['', [<any>Validators.required]]  
      });
    }
  
    modalClose_event() {
      this.closeModal.emit(true);
    }
  
  }
  