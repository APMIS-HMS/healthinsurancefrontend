import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';


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
  