import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reply-referal-tabs',
  templateUrl: './reply-referal-tabs.component.html',
  styleUrls: ['./reply-referal-tabs.component.scss']
})
export class ReplyReferalTabsComponent implements OnInit {

  referalFormGroup: FormGroup;
  
  symptomFormGroup: FormGroup;
  diagnosisFormGroup: FormGroup;
  procedureFormGroup: FormGroup;
  investigationFormGroup: FormGroup;
  drugFormGroup: FormGroup;

  tab_complaints = true;
  tab_upload = false;
  tab_notes = false;
  tab_clinicalNotes = false;
  tab_diagnosis = false;
  tab_treatment = false;
  tab_drug = false;
  tab_procedures = false;
  tab_services = false;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.referalFormGroup = this._fb.group({
      patientName: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      age: ['', [<any>Validators.required]],
      referingHospital: ['', [<any>Validators.required]],
      destinationHospital: ['', [<any>Validators.required]],
      visitClass: ['', [<any>Validators.required]],
      hiaResponsible: ['', [<any>Validators.required]],
      referingLashmaId: ['', [<any>Validators.required]],
      admissionDate: ['', [<any>Validators.required]],
      dischargeDate: ['', [<any>Validators.required]],
      visitDate: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      doctor: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]]
    });
  }

  tabComplaints_click() {
    this.tab_complaints = true;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabUpload_click() {
    this.tab_complaints = false;
    this.tab_upload = true;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabNotes_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = true;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }

  tabClinicalNotes_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = true;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabDiagnosiss_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = true;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabTreatment_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = true;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabDrug_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = true;
    this.tab_services = false;
  }

  tabServices_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = true;
  }
}
