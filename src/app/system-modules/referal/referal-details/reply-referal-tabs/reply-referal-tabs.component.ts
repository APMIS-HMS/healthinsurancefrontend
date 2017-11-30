import * as differenceInYears from 'date-fns/difference_in_years';
import { Observable } from 'rxjs/Rx';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { REQUEST_STATUS, CurrentPlaformShortName, DURATIONS, FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { ReferralService } from './../../../../services/referral/referral.service';
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
import { ReferralAuthorization } from './../../../../models/referral/referral';
import { PreAuthorizationDocument, Document } from './../../../../models/authorization/authorization';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilityService } from '../../../../services/index';

@Component({
  selector: 'app-reply-referal-tabs',
  templateUrl: './reply-referal-tabs.component.html',
  styleUrls: ['./reply-referal-tabs.component.scss']
})
export class ReplyReferalTabsComponent implements OnInit {
  @Input() selectedTransaction: PreAuthorizationDocument;
  @Input() selectedAuthorization: ReferralAuthorization;
  referalFormGroup: FormGroup;

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
  tab_upload = false;
  tab_notes = false;
  tab_clinicalNotes = false;
  tab_diagnosis = false;
  tab_treatment = false;
  tab_drug = false;
  tab_procedures = false;
  tab_services = false;

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
  currentPlatform: any;

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
  destinationFacilities: any[] = [];

  diagnosisTypes: any[] = [];
  packSizes: any[] = [];
  requestStatus = REQUEST_STATUS;


  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

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
    private _facilityService: FacilityService,
    private _referralService: ReferralService
  ) { }

  ngOnInit() {

    this.user = (<any>this._locker.getObject('auth')).user;

    this.durations = DURATIONS;
    this._getCurrentPlatform();
    this._getDiagnosisTypes();
    this._getDrugPackSizes();

    this._initializeFormGroup();
  }

  private _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getProviders();
      }
    }).catch(err => console.log(err));
  }
  _getProviders() {
    this._facilityService.find({
      query: {
        'facilityType.name': 'Provider',
        'platformOwnerId._id': this.currentPlatform._id
      }
    }).then((payload: any) => {
      this.destinationFacilities = payload.data;
    }).catch(err => {

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

    this.referalFormGroup = this._fb.group({
      destinationHospital: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      doctor: [this.selectedAuthorization !== undefined ? this.selectedAuthorization.medicalPersonelName : ''],
      unit: [this.selectedAuthorization !== undefined ? this.selectedAuthorization.medicalPersonelUnit : ''],
      clinicalNote: ['', [<any>Validators.required]]
    });

    this.referalFormGroup.controls.doctor.disable();
    this.referalFormGroup.controls.unit.disable();

    this.referalFormGroup.controls.destinationHospital.valueChanges.subscribe(value => {
      if (value !== null && value._id === this.user.facilityId._id) {
        this.referalFormGroup.controls.destinationHospital.reset();
        this.referalFormGroup.controls.destinationHospital.setErrors({ 'invalid': true });
      }
    })

    this.symptomFormGroup = this._fb.group({
      complaint: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.complaintLists = symptomObj.clinicalDocumentation;

    this.diagnosisFormGroup = this._fb.group({
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });
    this.diagnosisLists = diagnosisObj.clinicalDocumentation;

    this.procedureFormGroup = this._fb.group({
      procedure: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
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

    this.symptomFormGroup.controls.complaint.valueChanges
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

    this.procedureFormGroup.controls.procedure.valueChanges
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
      this._getPolicy();
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  _getPolicy() {
    this._systemService.on();
    let policy$ = Observable.fromPromise(this._policyService.find(
      {
        query: {
          $and: [
            { isActive: true },
            {
              $or: [
                { 'principalBeneficiary._id': this.selectedCheckIn.beneficiaryId },
                { 'dependantBeneficiaries.beneficiary._id': this.selectedCheckIn.beneficiaryId }
              ]
            }
          ]
        }
      }
    ));


    Observable.forkJoin([policy$]).subscribe((results: any) => {
      let policyResult = results[0];
      if (policyResult.data.length > 0) {
        this.selectedPolicy = policyResult.data[0];
        this.referalFormGroup.controls.hiaResponsible.setValue(this.selectedPolicy.hiaId.name);
      }

      this._systemService.off();
    }, error => {
      console.log(error)
    })
  }


  _getAge() {
    return differenceInYears(
      new Date(),
      this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth
    );
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

  send() {
    let counter = 0;
    try {
      this._systemService.on();
      if (this.referalFormGroup.valid) {
        let preAuthDoc: PreAuthorizationDocument = <PreAuthorizationDocument>{};
        preAuthDoc.document = [];
        preAuthDoc.approvedStatus = this.requestStatus[0];
        preAuthDoc.destinationProvider = this.referalFormGroup.controls.destinationHospital.value;

        //note start here
        preAuthDoc.document.push(
          <Document>{
            type: "Clinical Findings",
            clinicalDocumentation: this.referalFormGroup.controls.clinicalNote.value,
            approvedStatus: this.requestStatus[0],
            order: 2
          }
        );
        preAuthDoc.document.push(
          <Document>{
            type: "Reason for Request",
            clinicalDocumentation: this.referalFormGroup.controls.reason.value,
            approvedStatus: this.requestStatus[0],
            order: 7
          }
        );

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
        authorizationObject.documentation.push(preAuthDoc);

        // authorizationObject.isEmergency = this.referalFormGroup.controls.emergency.value;
        // authorizationObject.medicalPersonelName = this.referalFormGroup.controls.doctor.value;
        // authorizationObject.medicalPersonelUnit = this.referalFormGroup.controls.unit.value;
        // authorizationObject.providerFacilityId = this.user.facilityId;
        // authorizationObject.visityClassId = this.referalFormGroup.controls.visitClass.value;
        // authorizationObject.approvedStatus = this.requestStatus[0];
        // authorizationObject.referingProvider = this.user.facilityId;
        // authorizationObject.destinationProvider = this.referalFormGroup.controls.destinationHospital.value;

        console.log(authorizationObject);
        this._referralService.update(authorizationObject).then(payload => {
          console.log(payload);
          this._router.navigate(['/modules/referal/referals']);
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
          console.log(err);
        })


      } else {
        this._systemService.off();
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        console.log(this.referalFormGroup)
        Object.keys(this.referalFormGroup.controls).forEach((field, i) => { // {1}
          const control = this.referalFormGroup.get(field);
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
  needAuthorization(procedure) {
    if (procedure.procedure.PA === ' Y ') {
      return true;
    } else {
      return false;
    }
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
