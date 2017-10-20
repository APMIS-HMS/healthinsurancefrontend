import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from './../../../../services/common/claim.service';
import { Claim } from './../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-modal-reject-claim',
  templateUrl: './modal-reject-claim.component.html',
  styleUrls: ['./modal-reject-claim.component.scss']
})
export class ModalRejectClaimComponent implements OnInit {
  @Input() claimDetail: Claim = <Claim>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  user:any=<any>{};

  claimsRejectFormGroup: FormGroup;

  constructor(private _fb: FormBuilder, private _claimService: ClaimService,private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.claimsRejectFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['']
    });
    this.user = (<any>this._locker.getObject('auth')).user;
    let fullName = this.user.firstName +" "+this.user.lastName;
    this.claimsRejectFormGroup.controls.name.setValue(fullName);
    this.claimsRejectFormGroup.controls.institution.setValue(this.user.facilityId.name);
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
    if(this.claimDetail.documentations[this.claimDetail.documentations.length].response == undefined){
      this.claimDetail.documentations[this.claimDetail.documentations.length].response = response;
    }else{
      this.claimDetail.documentations.push({"response":response});
    }
    this.claimDetail.documentations[0].response = response;
    console.log(this.claimDetail);
    this._claimService.update(this.claimDetail).then((payload: any) => {
      console.log(payload);
    });
  }

}
