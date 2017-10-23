import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from './../../../../services/common/claim.service';
import { Claim } from './../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-modal-approve-claim',
  templateUrl: './modal-approve-claim.component.html',
  styleUrls: ['./modal-approve-claim.component.scss']
})
export class ModalApproveClaimComponent implements OnInit {

  @Input() claimDetail: Claim = <Claim>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  user:any=<any>{};

  claimsApproveFormGroup: FormGroup;

  constructor(private _fb: FormBuilder, private _claimService: ClaimService,private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.claimsApproveFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['']
    });
    this.user = (<any>this._locker.getObject('auth')).user;
    let fullName = this.user.firstName +" "+this.user.lastName;
    this.claimsApproveFormGroup.controls.name.setValue(fullName);
    this.claimsApproveFormGroup.controls.institution.setValue(this.user.facilityId.name);
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  onResponse() {
    var response = {
      "reason": this.claimsApproveFormGroup.controls.reason.value,
      "name": this.claimsApproveFormGroup.controls.name.value,
      "Institution": this.claimsApproveFormGroup.controls.institution.value,
      "isReject": true
    }
    if(this.claimDetail.documentations[this.claimDetail.documentations.length-1].response == undefined){
      this.claimDetail.documentations[this.claimDetail.documentations.length-1].response = response;
    }else{
      this.claimDetail.documentations.push({"response":response});
    }
    this.claimDetail.documentations[0].response = response;
    console.log(this.claimDetail);
    this._claimService.update(this.claimDetail).then((payload: any) => {
      console.log(payload);
      this.closeModal.emit(true);
    });
  }

}
