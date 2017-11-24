import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from './../../../../services/common/claim.service';
import { Claim } from './../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-modal-hold-claim',
  templateUrl: './modal-hold-claim.component.html',
  styleUrls: ['./modal-hold-claim.component.scss']
})
export class ModalHoldClaimComponent implements OnInit {

  @Input() claimDetail: Claim = <Claim>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() claimUpdated = new EventEmitter();
  
  claimsHoldFormGroup: FormGroup;
  user:any=<any>{};

  constructor(private _fb: FormBuilder,
    private _claimService: ClaimService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.claimsHoldFormGroup = this._fb.group({
      name: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      institution: ['', [<any>Validators.required]]  
    });
    this.user = (<any>this._locker.getObject('auth')).user;
    let fullName = this.user.firstName +" "+this.user.lastName;
    this.claimsHoldFormGroup.controls.name.setValue(fullName);
    this.claimsHoldFormGroup.controls.institution.setValue(this.user.facilityId.name);
    console.log(this.user.facilityId.name);
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

  onResponse() {
    var response = {
      "reason": this.claimsHoldFormGroup.controls.reason.value,
      "name": this.claimsHoldFormGroup.controls.name.value,
      "Institution": this.claimsHoldFormGroup.controls.institution.value,
      "isHold": true
    };
    if(this.claimDetail.documentations[this.claimDetail.documentations.length-1].response == undefined){
      this.claimDetail.documentations[this.claimDetail.documentations.length-1].response = response;
    }else{
      this.claimDetail.documentations.push({"response":response});
    }
    
    console.log(this.claimDetail);
    this._claimService.update(this.claimDetail).then((payload: any) => {
      console.log(payload);
    });
    this.claimUpdated.emit(true);
    this.closeModal.emit(true);
  }

}
  