import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

import { CoolLocalStorage } from 'angular2-cool-storage';
import { Claim } from './../../../../models/index';
import { CheckIn } from './../../../../models/check-in/check-in';
import { CheckInService } from './../../../../services/common/check-in.service';
import { ClaimService } from './../../../../services/common/claim.service';
import { ClaimTypeService } from './../../../../services/common/claim-type.service';
import { VisitTypeService } from './../../../../services/common/visit-type.service';
import { DiagnosisTypeService } from './../../../../services/common/diagnosis-type.service';
import { SymptomService } from './../../../../services/common/symptoms.service';
import { ProcedureService } from './../../../../services/common/procedure.service';
import { DiagnosisService } from './../../../../services/common/diagnosis.service';
import { InvestigationService } from './../../../../services/common/investigation.service';
import { DrugService } from './../../../../services/common/drug.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from './../../../../services/index';

@Component({
  selector: 'app-new-claim-tabs',
  templateUrl: './new-claim-tabs.component.html',
  styleUrls: ['./new-claim-tabs.component.scss']
})
export class NewClaimTabsComponent implements OnInit {
  @Input() claimItem: Claim = <Claim>{};
  claimsFormGroup: FormGroup;

  tab_symptoms = true;
  tab_diagnosis = false;
  tab_investigation = false;
  tab_drug = false;
  tab_procedure = false;
  tab_upload = false;
  tab_notes = false;

  searchResults = false;
  selectedDiagnosis: any;
  selectedProcedure: any;
  selectedInvestigation: any;
  selectedDrug: any;
  selectedSymptom: any;

  isProcessing = false;
  isItemselected = true;

  procedureSearchResult = false;
  drugSearchResult = false;
  diagnosisSearchResult = false;
  symptomSearchResult = false;
  investigationSearchResult = false;
  currentCheckIn: CheckIn = <CheckIn>{};

  SelectedCheckinItem: CheckIn = <CheckIn>{};
  SelectedCheckinItemPlan: any = <any>{};
  symptomLists: any = <any>[];
  diagnosisLists: any = <any>[];
  investigationList: any = <any>[];
  drugList: any = <any>[];
  procedureList: any = <any>[];

  clinicNote: any = <any>{};
  claimTypesItems: any = <any>[];
  visitTypesItems: any = <any>[];
  symptomItems: any = <any>[];
  procedureItems: any = <any>[];
  diagnosisItems: any = <any>[];
  investigationItems: any = <any>[];
  drugItems: any = <any>[];
  diagnosisTypeLists: any = <any>[];
  user: any;
  isOutpatient: boolean = false;
  isInpatient: boolean = false;

  

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _systemService: SystemModuleService,
    private _claimTypeService: ClaimTypeService,
    private _visitTypeService: VisitTypeService,
    private _symptomService: SymptomService,
    private _procedureService: ProcedureService,
    private _diagnosisService: DiagnosisService,
    private _diagnosisTypeService: DiagnosisTypeService,
    private _route: ActivatedRoute,
    private _drugService: DrugService,
    private _checkInService: CheckInService,
    private _claimService: ClaimService,
    private _investigationService: InvestigationService
  ) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
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
    if (this.claimItem.documentations != undefined) {
      this.diagnosisLists = this.claimItem.documentations[this.claimItem.index].diagnosis;
      this.drugList = this.claimItem.documentations[this.claimItem.index].drugs;
      this.investigationList = this.claimItem.documentations[this.claimItem.index].investigations;
      this.procedureList = this.claimItem.documentations[this.claimItem.index].procedures;
      this.symptomLists = this.claimItem.documentations[this.claimItem.index].symptoms;
      this.clinicNote = this.claimItem.documentations[this.claimItem.index].clinicNote;
    }
    // "visitType": this.claimsFormGroup.controls.visitClass.value,
    // "drugs": this.drugList,
    // "investigations": this.investigationList,
    // "procedures": this.procedureList,
    // "diagnosis": this.diagnosisLists,
    // "symptoms": this.symptomLists,
    // "clinicNote": this.claimsFormGroup.controls.clinicalNote.value

    this._getDiagnosisType();

    this.claimsFormGroup.controls.drug.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getDrugs(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.claimsFormGroup.controls.symptom.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getSymptoms(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.claimsFormGroup.controls.diagnosis.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.diagnosisItems.filter(x => x.name === value).length > 0)) {
          this.selectedDiagnosis = undefined;
          this._getDiagnosises(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.claimsFormGroup.controls.diagnosisType.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getProcedures(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.claimsFormGroup.controls.procedure.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getProcedures(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.claimsFormGroup.controls.investigations.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getInvestigations(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });
  }

  _getSymptoms(value) {

    if (value && value.length > 1) {
      this._symptomService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.symptomSearchResult = true;
          this.symptomItems = payload.data;
        }

      })
    }
  }

  _getProcedures(value) {
    if (value && value.length > 1) {
      this._procedureService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.procedureSearchResult = true;
          this.procedureItems = payload.data;
          console.log(this.procedureItems);
        }

      })
    }
  }

  _getDiagnosisType() {
    this._diagnosisTypeService.find({}).then((payload: any) => {
      if (payload.data.length > 0) {
        this.diagnosisTypeLists = payload.data;
      }

    })
  }

  _getDrugs(value) {
    if (value && value.length > 1) {
      this._drugService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.drugSearchResult = true;
          this.drugItems = payload.data;
          console.log(this.diagnosisItems)
        }

      })
    }
  }

  _getDiagnosises(value) {
    if (value && value.length > 1) {
      this._diagnosisService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.diagnosisSearchResult = true;
          this.diagnosisItems = payload.data;
          console.log(this.diagnosisItems)
        }

      })
    }
  }

  _getInvestigations(value) {
    if (value && value.length > 1) {
      this._investigationService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.investigationSearchResult = true;
          this.investigationItems = payload.data;
          console.log(this.investigationItems);
        }

      })
    }
  }

  onSelectSymptom(symptom) {
    this.claimsFormGroup.controls.symptom.setValue(symptom.name);
    this.symptomSearchResult = false;
    this.selectedSymptom = symptom;
  }

  onAddSymptom() {
    let name = this.claimsFormGroup.controls.symptom;
    let duration = this.claimsFormGroup.controls.symptomDuration;
    let unit = this.claimsFormGroup.controls.symptomUnit;
    if (name.valid) {
      this.symptomLists.push({
        "symptom": typeof (this.selectedSymptom.symptom) === 'object' ? this.selectedSymptom.symptom : name.value,
        "duration": typeof (this.selectedSymptom.duration) === 'object' ? this.selectedSymptom.duration : duration.value,
        "unit": typeof (this.selectedSymptom.unit) === 'object' ? this.selectedSymptom.unit : unit.value,
      });
      this.claimsFormGroup.controls.symptom.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }

  onSelectDiagnosis(diagnosis) {
    this.claimsFormGroup.controls.diagnosis.setValue(diagnosis.name);
    this.diagnosisSearchResult = false;
    this.selectedDiagnosis = diagnosis;
  }

  onAddDiagnosis() {
    let name = this.claimsFormGroup.controls.diagnosis;
    if (name.valid) {
      this.diagnosisLists.push({
        "diagnosis": typeof (this.selectedDiagnosis.name) === 'object' ? this.selectedDiagnosis : name.value,
        "type": this.claimsFormGroup.controls.diagnosisType.value
      });
      this.claimsFormGroup.controls.diagnosis.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }

  onSelectInvestigation(investigation) {
    this.claimsFormGroup.controls.investigations.setValue(investigation.name);
    this.investigationSearchResult = false;
    this.selectedInvestigation = investigation;
  }

  onAddInvestigation() {
    let name = this.claimsFormGroup.controls.investigations;
    if (name.valid) {
      this.investigationList.push({
        "investigation": typeof (this.selectedInvestigation.name) === 'object' ? this.selectedInvestigation : name.value,
      });
      this.claimsFormGroup.controls.investigations.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }

  onSelectDrug(drug) {
    this.claimsFormGroup.controls.drug.setValue(drug.name);
    this.drugSearchResult = false;
    this.selectedDrug = drug;
  }

  onAddDrug() {
    let name = this.claimsFormGroup.controls.drug;
    let qty = this.claimsFormGroup.controls.drugQty;
    let unit = this.claimsFormGroup.controls.drugUnit;
    if (name.valid && qty.value.length > 0) {
      this.drugList.push({
        "drug": typeof (this.selectedDrug.name) === 'object' ? this.selectedDrug : name.value,
        "quantity": qty.value,
        "unit": unit.value,
      });
      this.claimsFormGroup.controls.drug.reset();
      this.claimsFormGroup.controls.drugQty.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }

  onSelectProcedure(procedure) {
    this.claimsFormGroup.controls.procedure.setValue(procedure.name);
    this.procedureSearchResult = false;
    this.selectedProcedure = procedure;
  }

  onAddProcedure() {
    let name = this.claimsFormGroup.controls.procedure;
    if (name.valid) {
      this.procedureList.push({
        "procedure": typeof (this.selectedProcedure.name) === 'object' ? this.selectedProcedure : name.value,
      });
      this.claimsFormGroup.controls.procedure.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }

  generateNameAbbreviation(fullname) {
    var matches = fullname.toString().match(/\b(\w)/g);
    var acronym = matches.join('');
  }

  onRemove(data: any[], item: any) {
    const index: number = data.indexOf(item);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }


  onSendClaim() {
console.log("test");
    var request = {
      "visitType": this.claimsFormGroup.controls.visitClass.value,
      "drugs": this.drugList,
      "investigations": this.investigationList,
      "procedures": this.procedureList,
      "diagnosis": this.diagnosisLists,
      "symptoms": this.symptomLists,
      "clinicNote": this.claimsFormGroup.controls.clinicalNote.value
    };
    this.claimItem.claimNo = 1;
    this.claimItem.providerFacilityId = this.user.facilityId._id;
    this.claimItem.checkedinDetail = this.SelectedCheckinItem;
    this.claimItem.claimNote = this.claimsFormGroup.controls.claimsNote.value;
    this.claimItem.checkedinDetail.dateDischarged = this.claimsFormGroup.controls.dischargeDate.value;
    this.claimItem.checkedinDetail.visitDate = this.claimsFormGroup.controls.visitDate.value;
    this.claimItem.claimType = this.claimsFormGroup.controls.claimType.value;
    this.claimItem.medicalPersonelName = this.claimsFormGroup.controls.medicalPersonelName.value;
    //this.claimItem.medicalPersonelShortName = this.generateNameAbbreviation(this.claimsFormGroup.controls.medicalPersonelName);
    this.claimItem.authorizationCode = this.claimsFormGroup.controls.auth.value;
    this.claimItem.claimType = this.claimsFormGroup.controls.claimType.value;
    console.log(this.claimItem);
    this.isProcessing = true;
    if (this.claimItem.documentations == undefined) {
      this.claimItem.documentations = [{
        "request": request
      }];

      this._claimService.create(this.claimItem).then((payload: any) => {
        console.log(payload);
        this.claimsFormGroup.reset();
        this.isProcessing = false;
        this.navigateListClaim();
      }, error => {
        console.log(error);
        this.isProcessing = false;
      })
    } else {
      if (this.claimItem.documentations[this.claimItem.documentations.length - 1].request == undefined) {
        this.claimItem.documentations[this.claimItem.documentations.length - 1].request = request;
      } else {
        this.claimItem.documentations.push({ "request": request });
      }
      this._claimService.update(this.claimItem).then((payload: any) => {
        console.log(payload);
        this.claimsFormGroup.reset();
        this.isProcessing = false;
        this.navigateListClaim();
      }, error => {
        console.log(error);
        this.isProcessing = false;
      })
    }

  }

  navigateListClaim() {
    this._systemService.on();
    this._router.navigate(['/modules/claim']).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }


  tabSymptoms_click() {
    this.tab_symptoms = true;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabDiagnosis_click() {
    console.log(this.claimItem);
    this.tab_symptoms = false;
    this.tab_diagnosis = true;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabInvestigation_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = true;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabDrug_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = true;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabProcedure_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = true;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabUpload_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = true;
    this.tab_notes = false;
  }
  tabNotes_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = true;
  }
  tabSymptoms_click(){
    this.tab_symptoms = true;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabDiagnosis_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = true;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabInvestigation_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = true;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabDrug_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = true;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabProcedure_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = true;
    this.tab_upload = false;
    this.tab_notes = false;
  }
  tabUpload_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = true;
    this.tab_notes = false;
  }
  tabNotes_click(){
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = false;
    this.tab_upload = false;
    this.tab_notes = true;
  }

}