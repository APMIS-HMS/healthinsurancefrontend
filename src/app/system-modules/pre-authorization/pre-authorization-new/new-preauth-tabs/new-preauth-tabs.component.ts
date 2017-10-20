import { FORM_VALIDATION_ERROR_MESSAGE, REQUEST_STATUS, DURATIONS } from './../../../../services/globals/config';
import { Authorization, PreAuthorizationDocument, Document } from './../../../../models/authorization/authorization';
import { PreAuthorizationService } from './../../../../services/pre-authorization/pre-authorization.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PolicyService } from './../../../../services/policy/policy.service';
import { DrugPackSizeService } from './../../../../services/common/drug-pack-size.service';
import { DiagnosisTypeService } from './../../../../services/common/diagnosis-type.service';
import { InvestigationService } from './../../../../services/common/investigation.service';
import { DrugService } from './../../../../services/common/drug.service';
import { DiagnosisService } from './../../../../services/common/diagnosis.service';
import { ProcedureService } from './../../../../services/common/procedure.service';
import { SymptomService } from './../../../../services/common/symptoms.service';
import { CheckInService } from './../../../../services/common/check-in.service';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { VisitTypeService } from './../../../../services/common/visit-type.service';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import differenceInYears from 'date-fns/difference_in_years';

@Component({
  selector: 'app-new-preauth-tabs',
  templateUrl: './new-preauth-tabs.component.html',
  styleUrls: ['./new-preauth-tabs.component.scss']
})
export class NewPreauthTabsComponent implements OnInit {

  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: Authorization;

  preAuthFormGroup: FormGroup;
  symptomFormGroup: FormGroup;
  diagnosisFormGroup: FormGroup;
  procedureFormGroup: FormGroup;
  investigationFormGroup: FormGroup;
  drugFormGroup: FormGroup;

  tab_complaints = true;
  tab_diagnosis = false;
  tab_procedures = false;
  tab_services = false;
  tab_notes = false;
  tab_drugs = false;
  tab_clinicalNotes = false;

  complaintLists: any[] = [];
  diagnosisLists: any[] = [];
  investigationList: any[] = [];
  drugList: any = <any>[];
  procedureList: any[] = [];
  visitTypes: any[] = [];
  durations: any[] = [];
  symptomItems: any[] = [];
  procedureItems: any[] = [];
  diagnosisItems: any[] = [];
  investigationItems: any[] = [];
  drugItems: any[] = [];
  packSizes: any[] = [];
  diagnosisTypes: any[] = [];
  requestStatus = REQUEST_STATUS;


  selectedPreAuthorization: any;
  selectedCheckIn: any;
  selectedComplain: any;
  selectedDiagnosis: any;
  selectedProcedure: any;
  selectedInvestigation: any;
  selectedDrug: any;
  selectedPolicy: any;
  user: any;

  searchResults = false;
  complaintSearchResult = false;
  diagnosisSearchResult = false;
  procedureSearchResult = false;
  investigationSearchResult = false;
  drugSearchResult = false;
  Disabled = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _visitTypeService: VisitTypeService,
    private _systemService: SystemModuleService,
    private _checkInService: CheckInService,
    private _route: ActivatedRoute,
    private _symptomService: SymptomService,
    private _procedureService: ProcedureService,
    private _diagnosisService: DiagnosisService,
    private _drugService: DrugService,
    private _investigationService: InvestigationService,
    private _diagnosisTypeService: DiagnosisTypeService,
    private _drugPackSizeService: DrugPackSizeService,
    private _policyService: PolicyService,
    private _toastr: ToastsManager,
    private _locker: CoolLocalStorage,
    private _preAuthorizationService: PreAuthorizationService
  ) { }

  ngOnInit() {
    this._initializeFormGroup();
    this.durations = DURATIONS;
    this._getVisitTypes();
    this._getDiagnosisTypes();
    this._getDrugPackSizes();
  }

  _initializeFormGroup() {
    if (this.selectedPreAuthorization !== undefined && this.selectedPreAuthorization._id !== undefined) {
      this.today = {
        year: new Date(this.selectedPreAuthorization.encounterDateTime).getFullYear(),
        month: new Date(this.selectedPreAuthorization.encounterDateTime).getMonth() + 1,
        day: new Date(this.selectedPreAuthorization.encounterDateTime).getDate()
      }
    } else {
      this.today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }

    let symptomObj = this.selectedTransaction.document[0];
    let clinicalNoteObj = this.selectedTransaction.document[1];
    let diagnosisObj = this.selectedTransaction.document[2];
    let investigationObj = this.selectedTransaction.document[3];
    let drugObj = this.selectedTransaction.document[4];
    let procedureObj = this.selectedTransaction.document[5];
    let reasonObj = this.selectedTransaction.document[6];
    let preAuthObj = this.selectedTransaction.document[7];

    this.preAuthFormGroup = this._fb.group({
      clinicalNote: [clinicalNoteObj != null ? clinicalNoteObj.clinicalDocumentation : '', [<any>Validators.required]],
      requestReason: [reasonObj != null ? reasonObj.clinicalDocumentation : '', [<any>Validators.required]],
      preAuthorizationNote: [preAuthObj != null ? preAuthObj.clinicalDocumentation : '', [<any>Validators.required]],
      docName: [this.selectedAuthorization != null ? this.selectedAuthorization.medicalPersonelName : '', []],
      docUnit: [this.selectedAuthorization != null ? this.selectedAuthorization.medicalPersonelUnit : '', []],
    });

    let ctrlDocUnit = this.preAuthFormGroup.get('docUnit');
    let ctrlDocName = this.preAuthFormGroup.get('docName');
    ctrlDocUnit.disable();
    ctrlDocName.disable();

    this.symptomFormGroup = this._fb.group({
      presentingComplaints: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintsDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintsUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.complaintLists = symptomObj.clinicalDocumentation;

    this.diagnosisFormGroup = this._fb.group({
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.diagnosisLists = diagnosisObj.clinicalDocumentation;

    this.procedureFormGroup = this._fb.group({
      procedures: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.procedureList = procedureObj.clinicalDocumentation;

    this.investigationFormGroup = this._fb.group({
      services: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.investigationList = investigationObj.clinicalDocumentation;

    this.drugFormGroup = this._fb.group({
      drug: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      drugQty: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      drugUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.drugList = drugObj.clinicalDocumentation;

    this.drugFormGroup.controls.drug.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.drugItems.filter(x => x.name === value).length > 0)) {
          this.selectedDrug = undefined;
          this._getDrugs(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.symptomFormGroup.controls.presentingComplaints.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.symptomItems.filter(x => x.name === value).length > 0)) {
          this.selectedComplain = undefined;
          this._getSymptoms(value);
        }

      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.diagnosisFormGroup.controls.diagnosis.valueChanges
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

    this.procedureFormGroup.controls.procedures.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.procedureItems.filter(x => x.name === value).length > 0)) {
          this.selectedProcedure = undefined;
          this._getProcedures(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.investigationFormGroup.controls.services.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.investigationItems.filter(x => x.name === value).length > 0)) {
          this.selectedInvestigation = undefined;
          this._getInvestigations(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

  }
  _getDiagnosisTypes() {
    this._systemService.on();
    this._diagnosisTypeService.find({}).then((payload: any) => {
      this.diagnosisTypes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }
  _getSymptoms(value) {
    if (value && value.length > 1) {
      this._symptomService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.complaintSearchResult = true;
          this.symptomItems = payload.data
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
          this.procedureItems = payload.data
        }

      })
    }
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
        }

      })
    }
  }

  _getAge() {
    return differenceInYears(
      new Date(),
      this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth
    )
  }
  _getAddress() {
    return this.selectedCheckIn.beneficiaryObject.personId.homeAddress.street + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.neighbourhood + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.lga.name + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.state.name
  }

  _getDrugPackSizes() {
    this._systemService.on();
    this._drugPackSizeService.find({}).then((payload: any) => {
      this.packSizes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getVisitTypes() {
    this._systemService.on();
    this._visitTypeService.find({}).then((payload: any) => {
      this.visitTypes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  needAuthorization(procedure) {
    if (procedure.procedure.PA === ' Y ') {
      return true;
    } else {
      return false;
    }
  }

  removeComplain(complain, i) {
    this.complaintLists.splice(i);
  }

  removeDiagnosis(diagnosis, i) {
    this.diagnosisLists.splice(i);
  }
  removeProcedure(i) {
    this.procedureList.splice(i);
  }
  removeInvestigation(i) {
    this.investigationList.splice(i);
  }
  removeDrug(i) {
    this.drugList.splice(i);
  }

  onSelectComplain(complain) {
    this.symptomFormGroup.controls.presentingComplaints.setValue(complain.name);
    this.complaintSearchResult = false;
    this.selectedComplain = complain;
  }
  onSelectDiagnosis(diagnosis) {
    this.diagnosisFormGroup.controls.diagnosis.setValue(diagnosis.name);
    this.diagnosisSearchResult = false;
    this.selectedDiagnosis = diagnosis;
  }
  onSelectProcedure(procedure) {
    this.procedureFormGroup.controls.procedures.setValue(procedure.name);
    this.procedureSearchResult = false;
    this.selectedProcedure = procedure;
  }
  onSelectInvestigation(investigation) {
    this.investigationFormGroup.controls.services.setValue(investigation.name);
    this.investigationSearchResult = false;
    this.selectedInvestigation = investigation;
  }
  onSelectDrug(drug) {
    this.drugFormGroup.controls.drug.setValue(drug.name);
    this.drugSearchResult = false;
    this.selectedDrug = drug;
  }
  onAddDrug() {
    let name = this.drugFormGroup.controls.drug;
    let unit = this.drugFormGroup.controls.drugUnit;
    let quantity = this.drugFormGroup.controls.drugQty;
    if (name.valid && unit.valid && quantity.valid && typeof (this.selectedDrug) === 'object') {
      this.drugList.push({
        "drug": typeof (this.selectedDrug) === 'object' ? this.selectedDrug : name.value,
        "unit": unit.value,
        "quantity": quantity.value,
        "checked":false,
        "approvedStatus":this.requestStatus[0]
      });
      this.drugFormGroup.controls.drug.reset();
      unit.reset();
      quantity.reset(1);
    } else {
      name.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
      quantity.markAsDirty({ onlySelf: true });
    }
  }
  onAddInvestigation() {
    let name = this.investigationFormGroup.controls.services;

    if (name.valid) {
      this.investigationList.push({
        "investigation": typeof (this.selectedInvestigation) === 'object' ? this.selectedInvestigation : name.value,
        "checked":false,
        "approvedStatus":this.requestStatus[0]
      });
      this.investigationFormGroup.controls.services.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }
  onAddProcedure() {
    let name = this.procedureFormGroup.controls.procedures;
    if (name.valid) {
      this.procedureList.push({
        "procedure": typeof (this.selectedProcedure) === 'object' ? this.selectedProcedure : name.value,
        "checked":false,
        "approvedStatus":this.requestStatus[0]
      });
      this.procedureFormGroup.controls.procedures.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }

  }
  onAddDiagnosis() {
    let name = this.diagnosisFormGroup.controls.diagnosis;
    let diagnosisType = this.diagnosisFormGroup.controls.diagnosisType;
    if (name.valid && diagnosisType.valid) {
      this.diagnosisLists.push({
        "diagnosis": typeof (this.selectedDiagnosis) === 'object' ? this.selectedDiagnosis : name.value,
        "diagnosisType": diagnosisType.value,
        "checked":false,
        "approvedStatus":this.requestStatus[0]
      });
      this.diagnosisFormGroup.controls.diagnosis.reset();
      diagnosisType.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
      diagnosisType.markAsDirty({ onlySelf: true })
    }

  }
  onAddComplaint() {
    let name = this.symptomFormGroup.controls.presentingComplaints;
    let duration = this.symptomFormGroup.controls.complaintsDuration;
    let unit = this.symptomFormGroup.controls.complaintsUnit;
    if (name.valid && duration.valid && unit.valid) {
      this.complaintLists.push({
        "symptom": typeof (this.selectedComplain) === 'object' ? this.selectedComplain : name.value,
        "duration": duration.value,
        "unit": unit.value,
        "checked":false,
        "approvedStatus":this.requestStatus[0]
      });
      name.reset();
      duration.reset(1);
      unit.reset(this.durations[0]);
    } else {
      name.markAsDirty({ onlySelf: true });
      duration.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
    }

  }


  send() {
    console.log(this.preAuthFormGroup.valid);
    console.log(this.preAuthFormGroup);
    let counter = 0;
    try {
      this._systemService.on();
      if (this.preAuthFormGroup.valid) {
        console.log(this.complaintLists);
        console.log(this.procedureList);


        let preAuthDoc: PreAuthorizationDocument = <PreAuthorizationDocument>{};
        preAuthDoc.approvedStatus = this.requestStatus[0];
        preAuthDoc.document = [];
        //note start here
        preAuthDoc.document.push(
          <Document>{
            type: "Clinical Findings",
            clinicalDocumentation: this.preAuthFormGroup.controls.clinicalNote.value,
            approvedStatus: this.requestStatus[0],
            order: 2
          }
        );
        preAuthDoc.document.push(
          <Document>{
            type: "Reason for Request",
            clinicalDocumentation: this.preAuthFormGroup.controls.requestReason.value,
            approvedStatus: this.requestStatus[0],
            order: 7
          }
        );

        preAuthDoc.document.push(
          <Document>{
            type: "Pre Authorization Note",
            clinicalDocumentation: this.preAuthFormGroup.controls.preAuthorizationNote.value,
            approvedStatus: this.requestStatus[0],
            order: 8
          }
        )

        //note ends here
        //others

        if (this.complaintLists.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Symptoms",
              clinicalDocumentation: this.complaintLists,
              approvedStatus: this.requestStatus[0],
              order: 1
            }
          );
        }

        if (this.procedureList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Procedures",
              clinicalDocumentation: this.procedureList,
              approvedStatus: this.requestStatus[0],
              order: 6
            }
          );
        }

        if (this.investigationList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Investigations",
              clinicalDocumentation: this.investigationList,
              approvedStatus: this.requestStatus[0],
              order: 4
            }
          );
        }

        if (this.diagnosisLists.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Diagnosis",
              clinicalDocumentation: this.diagnosisLists,
              approvedStatus: this.requestStatus[0],
              order: 3
            }
          );
        }

        if (this.drugList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Drugs",
              clinicalDocumentation: this.drugList,
              approvedStatus: this.requestStatus[0],
              order: 5
            }
          );
        }



        let authorizationObject = this.selectedAuthorization;
        // authorizationObject.checkedInDetails = this.selectedCheckIn;
        // authorizationObject.dateOfRequest = this.preAuthFormGroup.controls.requestDate.value.jsdate;
        // authorizationObject.documentation = [];
        authorizationObject.documentation.push(preAuthDoc);
        // authorizationObject.policyId = this.selectedPolicy;

        // authorizationObject.isEmergency = this.preAuthFormGroup.controls.emergency.value;
        // authorizationObject.medicalPersonelName = this.preAuthFormGroup.controls.docName.value;
        // authorizationObject.medicalPersonelUnit = this.preAuthFormGroup.controls.docUnit.value;
        // authorizationObject.providerFacilityId = this.user.facilityId;
        // authorizationObject.visityClassId = this.preAuthFormGroup.controls.visitClass.value;
        // authorizationObject.approvedStatus = this.requestStatus[0];

        console.log(authorizationObject);
        this._preAuthorizationService.update(authorizationObject).then(payload => {
          console.log(payload);
          this._router.navigate(['/modules/pre-auth/pre-authorizations']);
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
          console.log(err);
        })


      } else {
        console.log(this.preAuthFormGroup.errors)
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        Object.keys(this.preAuthFormGroup.controls).forEach((field, i) => { // {1}
          const control = this.preAuthFormGroup.get(field);
          if (!control.valid) {
            control.markAsDirty({ onlySelf: true });
            counter = counter + 1;
          }
        });
      }
    } catch (error) {
      this._systemService.off();
      console.log(error)
    }
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
