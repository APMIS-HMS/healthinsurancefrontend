import { UserService } from './../../../services/common/user.service';
import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DURATIONS } from './../../../services/globals/config';
import { PreAuthorizationService } from './../../../services/pre-authorization/pre-authorization.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PolicyService } from './../../../services/policy/policy.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Claim } from './../../../models/index';
import { CheckIn } from './../../../models/check-in/check-in';
import { CheckInService } from './../../../services/common/check-in.service';
import { ClaimService } from './../../../services/common/claim.service';
import { ClaimTypeService } from './../../../services/common/claim-type.service';
import { VisitTypeService } from './../../../services/common/visit-type.service';
import { DiagnosisTypeService } from './../../../services/common/diagnosis-type.service';
import { SymptomService } from './../../../services/common/symptoms.service';
import { ProcedureService } from './../../../services/common/procedure.service';
import { DiagnosisService } from './../../../services/common/diagnosis.service';
import { InvestigationService } from './../../../services/common/investigation.service';
import { DrugService } from './../../../services/common/drug.service';
import { DrugPackSizeService } from '../../../services/common/drug-pack-size.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from './../../../services/index';

import 'rxjs/add/operator/filter';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {

  newClaim = true;
  newClaimConfirm = false;

  showCodes = false;

  durations = [];

  claimsFormGroup: FormGroup;
  searchResults = false;
  selectedDiagnosis: any;
  selectedProcedure: any;
  selectedInvestigation: any;
  selectedDrug: any;
  selectedSymptom: any;

  isProcessing = false;
  isItemselected = true;
  isAuthorize = false;

  authorizeType = "";

  tab_symptoms = true;
  tab_diagnosis = false;
  tab_investigation = false;
  tab_drug = false;
  tab_procedure = false;
  tab_upload = false;
  tab_notes = false;

  procedureSearchResult = false;
  drugSearchResult = false;
  diagnosisSearchResult = false;
  symptomSearchResult = false;
  investigationSearchResult = false;

  checkInDate: any = <any>{};
  currentCheckIn: CheckIn = <CheckIn>{};
  claimItem: Claim = <Claim>{};
  SelectedCheckinItem: any = <any>{};
  SelectedCheckinItemPlan: any = <any>{};
  packSizes = [];
  symptomLists = [];
  diagnosisLists = [];
  investigationList = [];
  drugList = [];
  procedureList = [];
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
  employees: any[] = [];
  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _systemService: SystemModuleService,
    private _claimTypeService: ClaimTypeService,
    private _visitTypeService: VisitTypeService,
    private _symptomService: SymptomService,
    private _drugPackSizeService: DrugPackSizeService,
    private _procedureService: ProcedureService,
    private _diagnosisService: DiagnosisService,
    private _policyService: PolicyService,
    private _preAuthorizationService: PreAuthorizationService,
    private _diagnosisTypeService: DiagnosisTypeService,
    private _route: ActivatedRoute,
    private _drugService: DrugService,
    private _checkInService: CheckInService,
    private _claimService: ClaimService,
    private _userService: UserService,
    private _investigationService: InvestigationService) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getSelectedCheckinItem(param.id);
      }
    });
    this.durations = DURATIONS;
    this._getEmployees();

    this.claimsFormGroup = this._fb.group({
      patientName: ['', [<any>Validators.required]],
      lashmaid: ['', [<any>Validators.required]],
      hospital: ['', [<any>Validators.required]],
      medicalPersonelName: ['', [<any>Validators.required]],
      docunit: [''],
      plan: [''],
      auth: [''],
      entryDate: [''],
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
    this._getClaimTypes();
    this._getVisitTypes();
    this._getDiagnosisType();
    this._getDrugPackSizes();

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

    this.claimsFormGroup.controls.medicalPersonelName.valueChanges
      .subscribe(value => {
        console.log(value);
        this.claimsFormGroup.controls.docunit.setValue(value.unit);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

  }


  _getSelectedCheckinItem(checkinId) {
    var clinicNote = "";
    console.log(checkinId);
    this._preAuthorizationService.find({ query: { "checkedInDetails": checkinId } }).then((preauth_callback: any) => {
      console.log(preauth_callback);
      if (preauth_callback.data.length > 0) {
        this.isAuthorize = true;
        this.authorizeType = "Free for Service"
        this.SelectedCheckinItem = preauth_callback.data[0];
        this.SelectedCheckinItem.checkedInDetails.beneficiaryObject = {};
        this.SelectedCheckinItem.checkedInDetails.beneficiaryObject = this.SelectedCheckinItem.beneficiaryObject;
        this.SelectedCheckinItem.providerFacility = this.SelectedCheckinItem.policyId.providerId.name;
        this.SelectedCheckinItem.plan = this.SelectedCheckinItem.policyId.planTypeId.name;
        console.log(this.SelectedCheckinItem);
        preauth_callback.data.forEach(element => {
          console.log("2" + element);
          element.documentation.forEach(element2 => {
            console.log(element2);
            if (element2.document[3] != undefined) {
              element2.document[3].clinicalDocumentation.forEach(item => {
                this.symptomLists.push({
                  "symptom": item.symptom.name,
                  "duration": item.duration,
                  "unit": item.unit.name
                });
              });
            }
            if (element2.document[4] != undefined) {
              element2.document[4].clinicalDocumentation.forEach(item => {
                this.procedureList.push({
                  "procedure": item.procedure.name
                });
              });
            }
            if (element2.document[5] != undefined) {
              element2.document[5].clinicalDocumentation.forEach(item => {
                this.investigationList.push({
                  "investigation": item.investigation.name
                });
              });
            }
            if (element2.document[6] != undefined) {
              element2.document[6].clinicalDocumentation.forEach(item => {
                this.diagnosisLists.push({
                  "diagnosis": item.diagnosis.name,
                  "type": item.diagnosisType.name
                });
              });
            }
            if (element2.document[7] != undefined) {
              element2.document[7].clinicalDocumentation.forEach(item => {
                this.drugList.push({
                  "drug": item.drug.name,
                  "quantity": item.quantity,
                  "unit": item.unit.name
                });
              });
            }

            clinicNote += element2.document[0].clinicalDocumentation + " ";
            this.claimsFormGroup.controls.clinicalNote.setValue(clinicNote);
          })
        });
      } else {
        this.isAuthorize = false;
        this.authorizeType = "Capitation";
        this.SelectedCheckinItem.checkedInDetails = {};
        console.log(checkinId);
        this._checkInService.find({ query: { _id: checkinId, $limit: 1 } }).then((payload: any) => {
          console.log(payload.data[0]);
          this.SelectedCheckinItem.checkedInDetails = payload.data[0];
          this.SelectedCheckinItem.providerFacility = this.SelectedCheckinItem.checkedInDetails.policyObject.providerId.name;
          this.SelectedCheckinItem.plan = this.SelectedCheckinItem.checkedInDetails.policyObject.planTypeId.name;
          // let policyId = this._locker.getObject('policyID');
          // console.log(policyId);
          this.SelectedCheckinItem.policyId = {};
          this.SelectedCheckinItem.policyId.planId = {};

          // this._policyService.find({ query: { _id: policyId, $limit: 1 } }).then((payload2:any)=>{
          //   this.SelectedCheckinItem.policyId.planId.name = payload2.data[0].planId.planType.name;
          // })
          delete payload.data[0].providerFacilityId;
          console.log(this.SelectedCheckinItem);
          if (this.SelectedCheckinItem.encounterType == "In-Patient") {
            this.isInpatient = true;
            this.isOutpatient = false;
          } else {
            this.isOutpatient = true;
            this.isInpatient = false;
          }
          console.log(this.SelectedCheckinItem);
        })
      }
    })

  }
  _getEmployees() {
    if (this.user.userType.name === 'Provider') {
      this._systemService.on();
      this._userService.find({
        query: {
          'facilityId._id': this.user.facilityId._id,
          $select: ['firstName', 'lastName', 'profession', 'cader', 'unit', 'otherNames']
        }
      }).then((payload: any) => {
        this.employees = payload.data;
        console.log(this.employees)
        this._systemService.off();
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      })
    }
  }

  _getClaimTypes() {
    this._systemService.on();
    this._visitTypeService.find({}).then((payload: any) => {
      this.claimTypesItems = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getVisitTypes() {
    this._systemService.on();
    this._visitTypeService.find({}).then((payload: any) => {
      this.visitTypesItems = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getDrugPackSizes() {
    this._systemService.on();
    this._drugPackSizeService.find({}).then((payload: any) => {
      this.packSizes = payload.data;
      console.log(this.packSizes);
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
    this._systemService.on();
    this._diagnosisTypeService.find({}).then((payload: any) => {
      this.diagnosisTypeLists = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
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
    console.log("Inside drug list");
    let name = this.claimsFormGroup.controls.drug;
    let qty = this.claimsFormGroup.controls.drugQty;
    let unit = this.claimsFormGroup.controls.drugUnit;
    console.log(qty.value.toString().length);
    console.log(name.valid)
    if (name.valid && qty.value.toString().length > 0) {
      this.drugList.push({
        "drug": typeof (this.selectedDrug.name) === 'object' ? this.selectedDrug : name.value,
        "quantity": qty.value,
        "unit": unit.value,
      });
      this.claimsFormGroup.controls.drug.reset();
      unit.reset();
      qty.reset(1);
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


  onSendClaim(valid) {
    var request = {
      "visitType": this.claimsFormGroup.controls.visitClass.value,
      "drugs": this.drugList,
      "investigations": this.investigationList,
      "procedures": this.procedureList,
      "diagnosis": this.diagnosisLists,
      "symptoms": this.symptomLists,
      "clinicNote": this.claimsFormGroup.controls.clinicalNote.value
    };
    this.claimItem.documentations = [{
      "request": request
    }];
    //this.claimItem.claimNo = 1;
    this.claimItem.providerFacilityId = this.user.facilityId._id;
    this.claimItem.checkedinDetail = this.SelectedCheckinItem;
    this.claimItem.claimNote = this.claimsFormGroup.controls.claimsNote.value;
    this.claimItem.checkedinDetail.dateDischarged = this.claimsFormGroup.controls.dischargeDate.value;
    this.claimItem.checkedinDetail.visitDate = this.claimsFormGroup.controls.visitDate.value;
    this.claimItem.claimType = this.claimsFormGroup.controls.claimType.value;
    this.claimItem.medicalPersonelName = this.claimsFormGroup.controls.medicalPersonelName.value.firstName +" "+this.claimsFormGroup.controls.medicalPersonelName.value.lastName;
    //this.claimItem.medicalPersonelShortName = this.generateNameAbbreviation(this.claimsFormGroup.controls.medicalPersonelName);
    this.claimItem.authorizationCode = this.claimsFormGroup.controls.auth.value;
    this.claimItem.claimType = this.claimsFormGroup.controls.claimType.value;
    console.log(this.claimItem);
    this.isProcessing = true;
    this._claimService.create(this.claimItem).then((payload: any) => {
      console.log(payload);
      this.SelectedCheckinItem
      this.isProcessing = false;
      this.navigateListClaim();
    }, error => {
      console.log(error);
      this.isProcessing = false;
    })

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

  tabDrug_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = true;
    this.tab_procedure = false;
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

  tabSymptoms_click() {
    this.tab_symptoms = true;
    this.tab_diagnosis = false;
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

  tabProcedure_click() {
    this.tab_symptoms = false;
    this.tab_diagnosis = false;
    this.tab_investigation = false;
    this.tab_drug = false;
    this.tab_procedure = true;
    this.tab_upload = false;
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

  newClaim_click() {
    this.newClaim = true;
    this.newClaimConfirm = false;
  }
  newClaimConfirm_click() {
    this.newClaim = false;
    this.newClaimConfirm = true;
  }

  modal_close() {
    this.showCodes = false;
  }
  pop_codes() {
    this.showCodes = true;
  }

}
