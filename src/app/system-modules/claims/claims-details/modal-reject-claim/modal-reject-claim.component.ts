import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from './../../../../services/common/claim.service';
import { Claim } from './../../../../models/index';

@Component({
  selector: 'app-modal-reject-claim',
  templateUrl: './modal-reject-claim.component.html',
  styleUrls: ['./modal-reject-claim.component.scss']
})
export class ModalRejectClaimComponent implements OnInit {
  @Input() claimDetail: Claim = <Claim>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  claimsRejectFormGroup: FormGroup;

  constructor(private _fb: FormBuilder, private _claimService: ClaimService) { }

  ngOnInit() {
    this.claimsRejectFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['']
    });
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  onResponse() {
    var response = {
      "reason": this.claimsRejectFormGroup.controls.reason.value,
      "name": this.claimsRejectFormGroup.controls.name.value,
      "Institution": this.claimsRejectFormGroup.controls.institution.value,
      "isReject": true
    }
    this.claimDetail.documentations[0].response = response;
    console.log(this.claimDetail);
    this._claimService.update(this.claimDetail).then((payload: any) => {
      console.log(payload);
    });
  }

}
