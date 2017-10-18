import { DiagnosisTypeService } from './../../../services/common/diagnosis-type.service';
import { InvestigationService } from './../../../services/common/investigation.service';
import { DrugService } from './../../../services/common/drug.service';
import { DiagnosisService } from './../../../services/common/diagnosis.service';
import { ProcedureService } from './../../../services/common/procedure.service';
import { SymptomService } from './../../../services/common/symptoms.service';
import { CheckInService } from './../../../services/common/check-in.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { VisitTypeService } from './../../../services/common/visit-type.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import differenceInYears from 'date-fns/difference_in_years';
import { DURATIONS } from '../../../services/globals/config';

@Component({
  selector: 'app-pre-authorization-new',
  templateUrl: './pre-authorization-new.component.html',
  styleUrls: ['./pre-authorization-new.component.scss']
})
export class PreAuthorizationNewComponent implements OnInit {

  preAuthFormGroup: FormGroup;
  searchResults = false;
  complaintSearchResult = false;
  diagnosisSearchResult = false;
  procedureSearchResult = false;
  investigationSearchResult = false;
  Disabled = false;

  tab_complaints = true;
  tab_diagnosis = false;
  tab_procedures = false;
  tab_services = false;
  tab_notes = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;
  selectedPreAuthorization: any;
  selectedCheckIn: any;
  selectedComplain: any;
  selectedDiagnosis: any;
  selectedProcedure:any;
  selectedInvestigation:any;

  complaintLists: any[] = <any>[];
  diagnosisLists: any = <any>[];
  investigationList: any = <any>[];
  drugList: any = <any>[];
  procedureList: any = <any>[];
  visitTypes: any[] = [];
  durations: any[] = [];
  symptomItems: any = <any>[];
  procedureItems: any = <any>[];
  diagnosisItems: any = <any>[];
  investigationItems: any = <any>[];
  drugItems: any = <any>[];

  diagnosisTypes: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private loadingService: LoadingBarService,
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
    private _diagnosisTypeService: DiagnosisTypeService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Pre-Authorization');
    this._headerEventEmitter.setMinorRouteUrl('Create New Pre-Authorization');
    this.durations = DURATIONS;
    this._getVisitTypes();
    this._getDiagnosisTypes();
    this._initializeFormGroup();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getCheckedIn(param.id);
      }
    })
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
    this.preAuthFormGroup = this._fb.group({

      patientName: [this.selectedCheckIn != null ? this.selectedCheckIn.beneficiaryObject.personId.lastName + ' ' + this.selectedCheckIn.beneficiaryObject.personId.firstName + ' ' + this.selectedCheckIn.beneficiaryObject.personId.otherNames : '', [<any>Validators.required]],
      gender: [this.selectedCheckIn != null ? this.selectedCheckIn.beneficiaryObject.personId.gender.name : '', [<any>Validators.required]],
      age: [this.selectedCheckIn != null ? this._getAge() : 0, [<any>Validators.required]],
      address: [this.selectedCheckIn != null ? this._getAddress() : '', [<any>Validators.required]],
      healthCareProvider: [this.selectedCheckIn != null ? this.selectedCheckIn.providerFacilityId.name : '', [<any>Validators.required]],
      hia: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      visitClass: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      requestDate: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      requestTime: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      clinicalNote: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      emergency: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      presentingComplaints: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintsDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintsUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      procedures: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      requestReason: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      services: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      preAuthorizationNote: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      docName: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]]
    });

    // this.preAuthFormGroup.controls.drug.valueChanges
    // .debounceTime(250)
    // .distinctUntilChanged()
    // .subscribe(value => {
    //   this._getDrugs(value);
    // }, error => {
    //   this._systemService.off();
    //   console.log(error)
    // });

    this.preAuthFormGroup.controls.presentingComplaints.valueChanges
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

    this.preAuthFormGroup.controls.diagnosis.valueChanges
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

    this.preAuthFormGroup.controls.procedures.valueChanges
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

    this.preAuthFormGroup.controls.services.valueChanges
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
    if (this.searchResults == false) {
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
          console.log(this.investigationItems)
        }

      })
    }
  }
  _getCheckedIn(id) {
    this._systemService.on();
    this._checkInService.get(id, {}).then((payload: any) => {
      this.selectedCheckIn = payload;
      this._initializeFormGroup();
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
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

  onSelectComplain(complain) {
    this.preAuthFormGroup.controls.presentingComplaints.setValue(complain.name);
    this.complaintSearchResult = false;
    this.selectedComplain = complain;
  }
  onSelectDiagnosis(diagnosis) {
    this.preAuthFormGroup.controls.diagnosis.setValue(diagnosis.name);
    this.diagnosisSearchResult = false;
    this.selectedDiagnosis = diagnosis;
  }
  onSelectProcedure(procedure) {
    this.preAuthFormGroup.controls.procedures.setValue(procedure.name);
    this.procedureSearchResult = false;
    this.selectedProcedure = procedure;
  }
  onSelectInvestigation(investigation) {
    this.preAuthFormGroup.controls.services.setValue(investigation.name);
    this.investigationSearchResult = false;
    this.selectedInvestigation = investigation;
  }
  onAddInvestigation() {
    let name = this.preAuthFormGroup.controls.services;
    if (name.valid) {
      this.investigationList.push({
        "investigation": typeof (this.selectedInvestigation) === 'object' ? this.selectedInvestigation : name.value,
      });
      console.log(this.investigationList)
      this.preAuthFormGroup.controls.services.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }

  }
  onAddProcedure() {
    let name = this.preAuthFormGroup.controls.procedures;
    if (name.valid) {
      this.procedureList.push({
        "procedure": typeof (this.selectedProcedure) === 'object' ? this.selectedProcedure : name.value,
      });
      console.log(this.procedureList)
      this.preAuthFormGroup.controls.procedures.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }

  }
  onAddDiagnosis() {
    let name = this.preAuthFormGroup.controls.diagnosis;
    let diagnosisType = this.preAuthFormGroup.controls.diagnosisType;
    if (name.valid && diagnosisType.valid) {
      this.diagnosisLists.push({
        "diagnosis": typeof (this.selectedDiagnosis) === 'object' ? this.selectedDiagnosis : name.value,
        "diagnosisType": diagnosisType.value
      });
      this.preAuthFormGroup.controls.diagnosis.reset();
      diagnosisType.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
      diagnosisType.markAsDirty({ onlySelf: true })
    }

  }
  onAddComplaint() {
    let name = this.preAuthFormGroup.controls.presentingComplaints;
    let duration = this.preAuthFormGroup.controls.complaintsDuration;
    let unit = this.preAuthFormGroup.controls.complaintsUnit;
    if (name.valid && duration.valid && unit.valid) {
      this.complaintLists.push({
        "symptom": typeof (this.selectedComplain) === 'object' ? this.selectedComplain : name.value,
        "duration": this.preAuthFormGroup.controls.complaintsDuration.value,
        "unit": this.preAuthFormGroup.controls.complaintsUnit.value,
      });
      this.preAuthFormGroup.controls.presentingComplaints.reset();
      this.preAuthFormGroup.controls.complaintsDuration.reset(1);
      this.preAuthFormGroup.controls.complaintsUnit.reset(this.durations[0]);
    } else {
      name.markAsDirty({ onlySelf: true });
      duration.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
      // this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      // Object.keys(this.stepOneFormGroup.controls).forEach((field, i) => { // {1}
      //   const control = this.stepOneFormGroup.get(field);
      //   if (!control.valid) {
      //     control.markAsDirty({ onlySelf: true });
      //     counter = counter + 1;
      //   }
      // });
    }

  }

  needAuthorization(procedure){
    if(procedure.procedure.PA === ' Y '){
      return true;
    }else{
      return false;
    }
  }


  navigate(url: string, id: string) {
    if (!!id) {
      this.loadingService.startLoading();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }

  tabComplaints_click() {
    this.tab_complaints = true;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
  }
  tabDiagnosis_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = true;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = false;
  }
  tabProcedures_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = true;
    this.tab_services = false;
    this.tab_notes = false;
  }
  tabServices_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = true;
    this.tab_notes = false;
  }
  tabNotes_click() {
    this.tab_complaints = false;
    this.tab_diagnosis = false;
    this.tab_procedures = false;
    this.tab_services = false;
    this.tab_notes = true;
  }
}
