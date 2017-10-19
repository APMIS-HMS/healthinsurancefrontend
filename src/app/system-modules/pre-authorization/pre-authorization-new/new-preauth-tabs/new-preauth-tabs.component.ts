import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-preauth-tabs',
  templateUrl: './new-preauth-tabs.component.html',
  styleUrls: ['./new-preauth-tabs.component.scss']
})
export class NewPreauthTabsComponent implements OnInit {

  preAuthFormGroup: FormGroup;

  tab_complaints = true;
  tab_diagnosis = false;
  tab_procedures = false;
  tab_services = false;
  tab_notes = false;
  tab_drugs = false;
  tab_clinicalNotes = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.preAuthFormGroup = this._fb.group({
      clinicalNote: ['', [<any>Validators.required]],
      emergency: ['', [<any>Validators.required]],
      presentingComplaints: ['', [<any>Validators.required]],
      complaintsDuration: ['', [<any>Validators.required]],
      complaintsUnit: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]],
      diagnosisType: ['', [<any>Validators.required]],
      procedures: ['', [<any>Validators.required]],
      requestReason: ['', [<any>Validators.required]],
      services: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      drugQty: ['', [<any>Validators.required]],
      drugUnit: ['', [<any>Validators.required]],
      preAuthorizationNote: ['', [<any>Validators.required]],
      docName: ['', [<any>Validators.required]]
    });
  }
  
  tabComplaints_click() {
    this.tab_complaints = true;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
    this.tab_drugs = false;
    this.tab_clinicalNotes = false;
  }
  tabDiagnosis_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = true;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
    this.tab_drugs = false;
    this.tab_clinicalNotes = false;
  }
  tabProcedures_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = true;
    this.tab_services = false;
    this.tab_notes = false;
    this.tab_drugs = false;
    this.tab_clinicalNotes = false;
  }
  tabServices_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = true;
    this.tab_notes = false;
    this.tab_drugs = false;
    this.tab_clinicalNotes = false;
  }
  tabNotes_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = true;
    this.tab_drugs = false;
    this.tab_clinicalNotes = false;
  }
  tabDrugs_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
    this.tab_drugs = true;
    this.tab_clinicalNotes = false;
  }

  tabClinicalNotes_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
    this.tab_drugs = false;
    this.tab_clinicalNotes = true;
  }
}
