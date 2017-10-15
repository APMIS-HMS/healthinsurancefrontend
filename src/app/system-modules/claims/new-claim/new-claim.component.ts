import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Claim, ClaimDocument } from './../../../models/index';
import { CheckIn } from './../../../models/check-in/check-in';
import { ClaimTypeService } from './../../../services/common/claim-type.service';
import { VisitTypeService } from './../../../services/common/visit-type.service';
import { SymptomService } from './../../../services/common/symptoms.service';
import { ProcedureService } from './../../../services/common/procedure.service';
import { DiagnosisService } from './../../../services/common/diagnosis.service';
import { InvestigationService } from './../../../services/common/investigation.service';
import { DrugService } from './../../../services/common/drug.service';
import { SystemModuleService } from './../../../services/index';

import 'rxjs/add/operator/filter';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {

  claimsFormGroup: FormGroup;
  searchResults = false;
  searchResultSymptoms = false;
  currentCheckIn: CheckIn = <CheckIn>{};
  claimItem: Claim = <Claim>{};
  claimDocItem: ClaimDocument = <ClaimDocument>{};
  symptomLists: any = <any>[];
  diagnosisLists: any = <any>[];
  investigationList: any = <any>[];
  drugList: any = <any>[];
  procedureList: any = <any>[];
  claimTypesItems: any = <any>[];
  visitTypesItems: any = <any>[];
  symptomItems: any = <any>[];
  procedureItems: any = <any>[];
  diagnosisItems: any = <any>[];
  investigationItems: any = <any>[];
  drugItems: any = <any>[];

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _systemService: SystemModuleService,
    private _claimTypeService: ClaimTypeService,
    private _visitTypeService: VisitTypeService,
    private _symptomService: SymptomService,
    private _procedureService: ProcedureService,
    private _diagnosisService: DiagnosisService,
    private _drugService: DrugService,
    private _investigationService: InvestigationService) { }

  ngOnInit() {
    this.claimDocItem.clinicalDocument = {};
    this.claimDocItem.clinicalDocument.symptom = []
    this.symptomLists = [];
    this.claimsFormGroup = this._fb.group({
      // patientName: ['', [<any>Validators.required]],
      // lashmaid: ['', [<any>Validators.required]],
      // hospital: ['', [<any>Validators.required]],
      medicalPersonelName: ['', [<any>Validators.required]],
      // plan: ['', [<any>Validators.required]],
      auth: [''],
      //entryDate: ['', [<any>Validators.required]],
      claimType: ['', [<any>Validators.required]],
      symptom: [''],
      symptomDuration: [''],
      symptomUnit: [''],
      diagnosis: [''],
      drug: [''],
      drugQty: [''],
      drugUnit: [''],
      outPatient: [''],
      inPatient: [''],
      admissionDate: [''],
      dischargeDate: [''],
      clinicalNote: ['', [<any>Validators.required]],
      claimsNote: [''],
      visitClass: [''],
      visitDate: [''],
      investigations: [''],
      procedure: [''],
    });
    this._getClaimTypes();
    this._getVisitTypes();

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
        this._getDiagnosises(value);
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

  _getClaimTypes() {
    this._claimTypeService.find({}).then((payload: any) => {
      this.claimTypesItems = payload.data;
    })
  }

  _getVisitTypes() {
    this._visitTypeService.find({}).then((payload: any) => {
      this.visitTypesItems = payload.data;
    })
  }

  _getSymptoms(value) {
    if (value.length >= 3) {
      this._symptomService.find({}).then((payload: any) => {
        if (payload.data.length > 0) {
          this.symptomItems = payload.data.filter((filterItem: any) => {
            return (filterItem.name.toString().toLowerCase().includes(value.toString().toLowerCase()));
          })
        }
      })
    }
  }

  _getProcedures(value) {
    if (value.length >= 3) {
      this._procedureService.find({}).then((payload: any) => {
        if (payload.data.length > 0) {
          this.procedureItems = payload.data.filter((filterItem: any) => {
            return (filterItem.name.toString().toLowerCase().includes(value.toString().toLowerCase()));
          })
        }
      })
    }
  }

  _getDrugs(value) {
    if (value.length >= 3) {
      this._drugService.find({}).then((payload: any) => {
        if (payload.data.length > 0) {
          this.drugItems = payload.data.filter((filterItem: any) => {
            return (filterItem.name.toString().toLowerCase().includes(value.toString().toLowerCase()));
          })
        }
      })
    }
  }

  _getDiagnosises(value) {
    if (value.length >= 3) {
      this._diagnosisService.find({}).then((payload: any) => {
        if (payload.data.length > 0) {
          this.diagnosisItems = payload.data.filter((filterItem: any) => {
            return (filterItem.name.toString().toLowerCase().includes(value.toString().toLowerCase()));
          })
        }
      })
    }
  }

  _getInvestigations(value) {
    if (value.length >= 3) {
      this._investigationService.find({}).then((payload: any) => {
        if (payload.data.length > 0) {
          this.investigationItems = payload.data.filter((filterItem: any) => {
            return (filterItem.name.toString().toLowerCase().includes(value.toString().toLowerCase()));
          })
        }
      })
    }
  }

  onSelectSymptom(param) {
    this.claimsFormGroup.controls.symptom.setValue(param);
    this.symptomItems = [];
  }

  onAddSymptom() {
    this.symptomLists.push({
      "name": this.claimsFormGroup.controls.symptom.value,
      "duration": this.claimsFormGroup.controls.symptomDuration.value,
      "unit": this.claimsFormGroup.controls.symptomUnit.value,
    });
    console.log(this.symptomLists);
  }

  onSelectDiagnosis(param) {
    this.claimsFormGroup.controls.diagnosis.setValue(param);
    this.diagnosisItems = [];
  }

  onAddDiagnosis() {
    this.diagnosisLists.push({
      "name": this.claimsFormGroup.controls.diagnosis.value
    });
    console.log(this.diagnosisLists);
  }

  onSelectInvestigation(param) {
    this.claimsFormGroup.controls.investigations.setValue(param);
    this.investigationItems = [];
  }

  onAddInvestigation() {
    this.investigationList.push({
      "name": this.claimsFormGroup.controls.investigations.value
    });
  }

  onSelectDrug(param) {
    this.claimsFormGroup.controls.drug.setValue(param);
    this.drugItems = [];
  }

  onAddDrug() {
    this.drugList.push({
      "name": this.claimsFormGroup.controls.drug.value,
      "quantity": this.claimsFormGroup.controls.drugQty.value,
      "unit": this.claimsFormGroup.controls.drugUnit.value
    });
  }

  onSelectProcedure(param) {
    this.claimsFormGroup.controls.procedure.setValue(param);
    this.procedureItems = [];
  }

  onAddProcedure() {
    this.procedureList.push({
      "name": this.claimsFormGroup.controls.procedure.value
    });
  }


  onSendClaim() {
    this.claimDocItem.clinicalDocument = {
      "visitType":this.claimsFormGroup.controls.visitType.value,
      "drugs": this.drugList,
      "investigations": this.investigationList,
      "procedures": this.procedureList,
      "diagnosis": this.diagnosisLists,
      "symptoms": this.symptomLists
    };
    this.claimItem.authorizationCode = this.claimsFormGroup.controls.authorizationCode.value;
    //this.claimItem.
  }

}
