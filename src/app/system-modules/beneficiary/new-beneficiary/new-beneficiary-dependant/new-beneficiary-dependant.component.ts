import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-beneficiary-dependant',
  templateUrl: './new-beneficiary-dependant.component.html',
  styleUrls: ['./new-beneficiary-dependant.component.scss']
})
export class NewBeneficiaryDependantComponent implements OnInit {

  frmDependants: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.frmDependants = this._fb.group({
      firstName: ['', [<any>Validators.required]],
      title: ['', [<any>Validators.required]],
			middleName: [''],
      lastName: ['', [<any>Validators.required]],
      phonenumber: ['', [<any>Validators.required]],
      secondaryPhone: [''],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			dob: ['', [<any>Validators.required]],
			gender: ['', [<any>Validators.required]],
			relationship: ['', [<any>Validators.required]],
			lasrraId: ['', [<any>Validators.required]]
		});
  }

}
