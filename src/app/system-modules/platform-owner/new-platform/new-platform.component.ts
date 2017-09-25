import { BankService } from './../../../services/common/bank.service';
import { UserTypeService } from './../../../services/api-services/setup/user-type.service';
import { Address } from './../../../models/organisation/address';
import { Facility } from './../../../models/organisation/facility';
import { BankDetail } from './../../../models/organisation/bank-detail';
import { Contact } from './../../../models/organisation/contact';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { ContactPositionService, PlatformOwnerService } from '../../../services/index';
// import { Contact, BankDetail } from '../../../models/index';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ///^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
const FLOATING_REGIX = /^[-+]?[0-9]+\.[0-9]+$/

@Component({
  selector: 'app-new-platform',
  templateUrl: './new-platform.component.html',
  styleUrls: ['./new-platform.component.scss']
})
export class NewPlatformComponent implements OnInit {

  saveBtn: string = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
  platformFormGroup: FormGroup;
  
    constructor(
      private _fb: FormBuilder,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
    ) { }
  
    ngOnInit() {
      this._headerEventEmitter.setRouteUrl('New Platform');
      this._headerEventEmitter.setMinorRouteUrl('');
  
      this.platformFormGroup = this._fb.group({
        platformName: ['', [<any>Validators.required]],
        shortName: ['', [<any>Validators.required]],
        email:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
        website: ['', [<any>Validators.required]],
        address: ['', [<any>Validators.required]],
        bankAccName: ['', [<any>Validators.required]],
        bankAccNumber: ['', [<any>Validators.required]],
        bc_fname: ['', [<any>Validators.required]],
        bc_lname: ['', [<any>Validators.required]],
        bc_email:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],        
        bc_phone: ['', [<any>Validators.required]],
        bc_position: ['', [<any>Validators.required]],
        it_fname: ['', [<any>Validators.required]],
        it_lname: ['', [<any>Validators.required]],
        it_position: ['', [<any>Validators.required]],
        it_email:  ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],        
        it_phone: ['', [<any>Validators.required]],
      });
    }
  
}
