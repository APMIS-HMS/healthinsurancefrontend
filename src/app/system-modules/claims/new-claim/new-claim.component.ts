import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {

  claimsFormGroup: FormGroup;
  searchResults = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy', 
  };

  public today: IMyDate;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.claimsFormGroup = this._fb.group({
      patientName: ['', [<any>Validators.required]],
      lashmaid: ['', [<any>Validators.required]],
      hospital: ['', [<any>Validators.required]],
      doctor: ['', [<any>Validators.required]],
      plan: ['', [<any>Validators.required]],
      auth: ['', [<any>Validators.required]],
      entryDate: ['', [<any>Validators.required]],
      claimType: ['', [<any>Validators.required]],
      ffs: ['', [<any>Validators.required]],
      symtom: ['', [<any>Validators.required]],
      symtomDuration: ['', [<any>Validators.required]],
      symtomUnit: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      drugQty: ['', [<any>Validators.required]],
      drugUnit: ['', [<any>Validators.required]],
      outPatient: ['', [<any>Validators.required]],
      inPatient: ['', [<any>Validators.required]],
      admissionDate: ['', [<any>Validators.required]],
      dischargeDate: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]],
      claimsNote: ['', [<any>Validators.required]]  
    });
  }

}
