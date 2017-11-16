import { UserService } from './../../../services/common/user.service';
import { authModulesRoutes } from './../../../auth/auth.route';
import { PreAuthorizationService } from './../../../services/pre-authorization/pre-authorization.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Authorization, PreAuthorizationDocument, Document } from './../../../models/authorization/authorization';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FORM_VALIDATION_ERROR_MESSAGE, REQUEST_STATUS } from './../../../services/globals/config';
import { Observable } from 'rxjs/Observable';
import { PolicyService } from './../../../services/policy/policy.service';
import { DrugPackSizeService } from './../../../services/common/drug-pack-size.service';
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
import * as moment from 'moment';
@Component({
  selector: 'app-pre-authorization-new',
  templateUrl: './pre-authorization-new.component.html',
  styleUrls: ['./pre-authorization-new.component.scss']
})
export class PreAuthorizationNewComponent implements OnInit {

  newAuth = true;
  newAuthConfirm = false;

  showCodes = false;

  preAuthFormGroup: FormGroup;
  symptomFormGroup: FormGroup;
  diagnosisFormGroup: FormGroup;
  procedureFormGroup: FormGroup;
  investigationFormGroup: FormGroup;
  drugFormGroup: FormGroup;

  searchResults = false;
  complaintSearchResult = false;
  diagnosisSearchResult = false;
  procedureSearchResult = false;
  investigationSearchResult = false;
  drugSearchResult = false;
  Disabled = false;

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
  selectedPreAuthorization: any;
  selectedCheckIn: any;
  selectedComplain: any;
  selectedDiagnosis: any;
  selectedProcedure: any;
  selectedInvestigation: any;
  selectedDrug: any;
  selectedPolicy: any;
  user: any;

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

  diagnosisTypes: any[] = [];
  packSizes: any[] = [];
  employees:any[] = [];
  requestStatus = REQUEST_STATUS;


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
    private _userService:UserService,
    private _preAuthorizationService: PreAuthorizationService
  ) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._headerEventEmitter.setRouteUrl('New Pre-Authorization');
    this._headerEventEmitter.setMinorRouteUrl('Create New Pre-Authorization');
    this.durations = DURATIONS;
    this._getVisitTypes();
    this._getDiagnosisTypes();
    this._getDrugPackSizes();
    this._initializeFormGroup();
    this._getEmployees();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getCheckedIn(param.id);
      }
    })
    // this.testDateDiff();
  }

  _getEmployees(){
    if(this.user.userType.name==='Provider'){
      this._systemService.on();
      this._userService.find({
        query:{
          'facilityId._id':this.user.facilityId._id,
          $select:['firstName', 'lastName', 'profession','cader', 'unit', 'otherNames']
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
      hia: [this.selectedCheckIn != null ? this.selectedCheckIn.policyObject.hiaId.name : '', [<any>Validators.required]],
      visitClass: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      requestDate: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', []],
      requestTime: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : new Date(), []],
      clinicalNote: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      emergency: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : false, [<any>Validators.required]],
      requestReason: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      preAuthorizationNote: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      docName: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      docUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.symptomFormGroup = this._fb.group({
      presentingComplaints: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintsDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintsUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.diagnosisFormGroup = this._fb.group({
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.procedureFormGroup = this._fb.group({
      procedures: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.investigationFormGroup = this._fb.group({
      services: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.drugFormGroup = this._fb.group({
      drug: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      drugQty: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      drugUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

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

      this.preAuthFormGroup.controls.docName.valueChanges
      .subscribe(value => {
        this.preAuthFormGroup.controls.docUnit.setValue(value.unit);
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
  _getCheckedIn(id) {
    this._systemService.on();
    this._checkInService.get(id, {}).then((payload: any) => {
      this.selectedCheckIn = payload;
      this._initializeFormGroup();
      //this._getPolicy();
      console.log(this.selectedCheckIn);
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  // _getPolicy() {
  //   console.log(this.selectedCheckIn);
  //   this._systemService.on();
  //   this._policyService.find(
  //     {
  //       query: {
  //         $and: [
  //           { isActive: false },
  //           {
  //             $or: [
  //               { 'principalBeneficiary._id': this.selectedCheckIn.beneficiaryId },
  //               { 'dependantBeneficiaries.beneficiary._id': this.selectedCheckIn.beneficiaryId }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   ).then((results: any) => {
  //     // console.log(results);
  //     // let policyResult = results[0];
  //     console.log(results.data);
  //     if (results.data.length > 0) {
  //       this.selectedPolicy = results.data[0];
  //       this.preAuthFormGroup.controls.hia.setValue(this.selectedPolicy.hiaId.name);//.policyObject.hiaId.name
  //     }

  //     this._systemService.off();
  //   }, error => {
  //     console.log(error)
  //   })
  // }

  getDateDiff(date1, date2) {
    var b = moment(date1),
      a = moment(date2),
      intervals: any = ['years', 'months', 'weeks', 'days'],
      out = [];

    for (var i = 0; i < intervals.length; i++) {
      var diff = a.diff(b, intervals[i]);
      b.add(diff, intervals[i]);
      out.push(diff + ' ' + intervals[i]);
    }
    return out.join(', ');
  };

  testDateDiff(){
  var today   = new Date(),
      newYear = new Date(today.getFullYear(), 0, 1),
      y2k     = new Date(2000, 0, 1);

    //(AS OF NOV 29, 2016)
    //Time since New Year: 0 years, 10 months, 4 weeks, 0 days
    console.log( 'Time since New Year: ' + this.getDateDiff(newYear, today) );

    //Time since Y2K: 16 years, 10 months, 4 weeks, 0 days
    console.log( 'Time since Y2K: ' + this.getDateDiff(y2k, today) );
  }


  _getAge() {
    // return differenceInYears(
    //   new Date(),
    //   this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth
    // )
    return this.getDateDiff(this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth, new Date());
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
    console.log(name.valid)
    let unit = this.drugFormGroup.controls.drugUnit;
    let quantity = this.drugFormGroup.controls.drugQty;
   
    if (name.valid && unit.valid && quantity.valid && typeof (this.selectedDrug) === 'object') {
      let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedDrug);
      if(retObj.checked === false){
        this._toastr.info("Selected Drug does not require authorization!", "Info");
      }else{
        this.drugList.push({
          "drug": retObj.investigation,
          "unit": unit.value,
          "quantity": quantity.value,
          "checked": retObj.checked,
          "approvedStatus": retObj.approvedStatus
        });
      }

      this.drugFormGroup.controls.drug.reset();
      unit.reset();
      quantity.reset(1);
    } else {
      name.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
      quantity.markAsDirty({ onlySelf: true });
    }
  }
  checkProviderAuthorization(fc, resource) {
    console.log(fc);
    console.log(resource)
    if (fc === 'primary') {
      if (resource.P.toLowerCase().trim() == "p") {
        console.log(1)
        if (resource.PA.toLowerCase().trim() == "n") {
          console.log(2)
          // its approved
          let copyInvestigation = resource;
          delete copyInvestigation.Amount;
          console.log(copyInvestigation)
          return {
            'investigation': copyInvestigation,
            'approvedStatus': this.requestStatus[1],
            'checked': false
          }
        } else {
          //Requires authorization
          if (resource.Prefered != undefined) {
            if (resource.Prefered.toLowerCase().trim() == 'c') {
              console.log(3)
              // cover by capitation, dont put amount
              //requires authorization
              let copyInvestigation = resource;
              delete copyInvestigation.Amount;
              return {
                'investigation': copyInvestigation,
                'approvedStatus': this.requestStatus[0],
                'checked': true
              }
            } else {
              console.log(4)
              //set to approve and look for amount
              //requires authorization
              let copyInvestigation = resource;
              return {
                'investigation': copyInvestigation,
                'approvedStatus': this.requestStatus[0],
                'checked': true
              }
            }
          }
        }
      } else if (resource.P.toLowerCase().trim() == "e") {
        let copyInvestigation = resource;
        delete copyInvestigation.Amount;
        return {
          'investigation': copyInvestigation,
          'approvedStatus': this.requestStatus[1],
          'checked': false
        }
      }
    } else if (fc === 'secondary') {
      console.log(5)
      // get authorization, check amount
      let copyInvestigation = resource;
      return {
        'investigation': copyInvestigation,
        'approvedStatus': this.requestStatus[0],
        'checked': true
      }
    }
  }
  onAddInvestigation() {
    let name = this.investigationFormGroup.controls.services;
    console.log(this.selectedCheckIn)
    let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedInvestigation);
    console.log(retObj)
    if (name.valid) {
      if(retObj.checked === false){
        this._toastr.info("Selected Investigation does not require authorization!", "Info");
      }else{
        this.investigationList.push({
          "investigation": retObj.investigation,
          "checked": retObj.checked,
          "approvedStatus": retObj.approvedStatus
        });
      }
      this.investigationFormGroup.controls.services.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }
  onAddProcedure() {
    let name = this.procedureFormGroup.controls.procedures;
    let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedProcedure);
    if (name.valid) {

      if(retObj.checked === false){
        this._toastr.info("Selected Procedure does not require authorization!", "Info");
      }else{
        this.procedureList.push({
          "procedure": retObj.investigation,
          "checked": retObj.checked,
          "approvedStatus": this.requestStatus[0]
        });
      }



   
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
        "checked": false,
        "approvedStatus": this.requestStatus[0]
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
        "checked": false,
        "approvedStatus": this.requestStatus[0]
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

  needAuthorization(procedure) {
    console.log(procedure)
    if(procedure.drug !== undefined){
      console.log(1)
      if (procedure.drug.PA.trim() === 'Y') {
        console.log(2)
        return true;
      } else {
        console.log(3)
        return false;
      }
    }else{
      if (procedure.procedure.PA.trim() === 'Y') {
        return true;
      } else {
        return false;
      }
    }
   
  }

  send() {
    let counter = 0;
    try {
      this._systemService.on();
      if (this.preAuthFormGroup.valid) {

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



        let authorizationObject = <Authorization>{};
        authorizationObject.checkedInDetails = this.selectedCheckIn._id;
        authorizationObject.dateOfRequest = this.preAuthFormGroup.controls.requestDate.value.jsdate;
        authorizationObject.documentation = [];
        authorizationObject.documentation.push(preAuthDoc);
        authorizationObject.policyId = this.selectedCheckIn.policyObject._id;

        authorizationObject.isEmergency = this.preAuthFormGroup.controls.emergency.value;
        authorizationObject.medicalPersonelName = this.preAuthFormGroup.controls.docName.value;
        authorizationObject.medicalPersonelUnit = this.preAuthFormGroup.controls.docUnit.value;
        authorizationObject.providerFacilityId = this.user.facilityId._id;
        authorizationObject.visityClassId = this.preAuthFormGroup.controls.visitClass.value;
        authorizationObject.approvedStatus = this.requestStatus[0];
        authorizationObject.personId = this.selectedCheckIn.beneficiaryObject.personId._id;
        authorizationObject.principalBeneficiaryId = this.selectedCheckIn.principalBeneficiaryId;
        authorizationObject.beneficiaryId = this.selectedCheckIn.beneficiaryId

        console.log(authorizationObject);
        this._preAuthorizationService.create(authorizationObject).then(payload => {
          console.log(payload);
          this._router.navigate(['/modules/pre-auth/pre-authorizations']);
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
          console.log(err);
        })


      } else {
        this._systemService.off();
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        Object.keys(this.preAuthFormGroup.controls).forEach((field, i) => { // {1}
          const control = this.preAuthFormGroup.get(field);
          if (!control.valid) {
            control.markAsDirty({ onlySelf: true });
            counter = counter + 1;
          }
        });
        console.log(this.preAuthFormGroup)
      }
    } catch (error) {
      this._systemService.off();
      console.log(error)
    }
  }

  navigateAuthorizationList() {
    this._systemService.on();
    this._router.navigate(['/modules/pre-auth/pre-authorizations']).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
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

  newAuth_click() {
    this.newAuth = true;
    this.newAuthConfirm = false;
  }
  newAuthConfirm_click() {
    this.newAuth = false;
    this.newAuthConfirm = true;
  }
  modal_close() {
    this.showCodes = false;
  }
  pop_codes() {
    this.showCodes = true;
  }
}
