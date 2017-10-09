import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-beneficiary-program',
  templateUrl: './new-beneficiary-program.component.html',
  styleUrls: ['./new-beneficiary-program.component.scss']
})
export class NewBeneficiaryProgramComponent implements OnInit {

  frmProgram: FormGroup;
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.frmProgram = this._fb.group({
			hiaName: [''],
      programType: ['', [<any>Validators.required]],
      policy: ['', [<any>Validators.required]],
			programName: ['', [<any>Validators.required]],
			providerName: ['', [<any>Validators.required]]
		});
  }

}
