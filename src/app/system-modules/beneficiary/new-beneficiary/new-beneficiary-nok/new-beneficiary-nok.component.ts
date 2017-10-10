import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-beneficiary-nok',
  templateUrl: './new-beneficiary-nok.component.html',
  styleUrls: ['./new-beneficiary-nok.component.scss']
})
export class NewBeneficiaryNokComponent implements OnInit {

  frmNok: FormGroup;
  
    constructor(private _fb: FormBuilder) { }
  
    ngOnInit() {
      this.frmNok = this._fb.group({
        firstName: ['', [<any>Validators.required]],
        middleName: [''],
        title: ['', [<any>Validators.required]],
        lastName: ['', [<any>Validators.required]],
        phonenumber: ['', [<any>Validators.required]],
        secondaryPhone: [''],
        relationship: ['', [<any>Validators.required]],
        email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
        gender: ['', [<any>Validators.required]],
      });
    }
  
  }
  