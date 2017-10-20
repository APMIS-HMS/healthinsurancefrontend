import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-claim-tabs',
  templateUrl: './new-claim-tabs.component.html',
  styleUrls: ['./new-claim-tabs.component.scss']
})
export class NewClaimTabsComponent implements OnInit {

  claimsFormGroup: FormGroup;

  tab_symptoms = true;
  tab_diagnosis = false;
  tab_investigation = false;
  tab_drug = false;
  tab_procedure = false;
  tab_upload = false;
  tab_notes = false;

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
      medicalPersonelName: ['', [<any>Validators.required]],
      plan: ['', [<any>Validators.required]],
      auth: [''],
      entryDate: ['', [<any>Validators.required]],
      claimType: ['', [<any>Validators.required]],
      symptom: [''],
      symptomDuration: [''],
      symptomUnit: [''],
      diagnosis: [''],
      diagnosisType: [''],
      drug: [''],
      drugQty: [''],
      drugUnit: [''],
      outPatient: [''],
      inPatient: [''],
      //admissionDate: [''],
      dischargeDate: [''],
      clinicalNote: ['', [<any>Validators.required]],
      claimsNote: [''],
      visitClass: [''],
      visitDate: [''],
      investigations: [''],
      procedure: ['']
    });
  }

}
