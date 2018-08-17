import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService, FacilityService, BeneficiaryService, PolicyService, PersonService } from '../../../../services';
import { PRE_MEDICAL_CONDITIONS, BLOOD_GROUPS, GENOTYPES } from '../../../../services/globals/config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-new-beneficiary-medical',
  templateUrl: './new-beneficiary-medical.component.html',
  styleUrls: ['./new-beneficiary-medical.component.scss']
})
export class NewBeneficiaryMedicalComponent implements OnInit {
  selectedBeneficiary: any;
  user: any;
  person: any;
  medicalFormGroup: FormGroup;
  bloodGroups: any = BLOOD_GROUPS;
  genotypes: any = GENOTYPES;
  preMedicalConditions: any = PRE_MEDICAL_CONDITIONS;
  selectedPreMedicalConditions = [];

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _personService: PersonService
  ) {}

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this.medicalFormGroup = this._fb.group({
      bloodGroup: ['', [<any>Validators.required]],
      genotype: ['', [<any>Validators.required]],
      otherPreMed: [''],
    });

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      }
    });
  }

  onClickStepThree(valid, value) {
    if (valid) {
      this._systemService.on();
      console.log(this.selectedBeneficiary);
      const payload = {
        personId: this.selectedBeneficiary.personId._id,
        medical: {
          bloodGroup: value.bloodGroup,
          genotype: value.genotype,
          preMedicalConditions: this.selectedPreMedicalConditions,
          otherPreMedicalCondition: value.otherPreMed,
        }
      };
      console.log(payload);
      this._beneficiaryService.saveBeneficiaryMedical(payload).then(res => {
        console.log(res);
        this._systemService.off();
        if (res.statusCode === 200 && res.error === false) {
          this._router.navigate(['/modules/beneficiary/new/dependants', this.selectedBeneficiary._id]).then(route => {
            // Route to dependant
          }).catch(err => { });
        }
      }).catch(err => {
        this._systemService.off();
        console.log(err);
      });
    } else {
      this._systemService.announceSweetProxy('Please fill all required fields', 'error');
    }
  }

  moveBackToStepOne() {
    this._router.navigate(['/modules/beneficiary/new/principal', this.selectedBeneficiary._id]).then(res => {
      console.log(res);
    }).catch(err => { console.log(err)});
  }

  _getBeneficiary(beneficiaryId) {
    this._systemService.on();
    this._beneficiaryService.get(beneficiaryId, {}).then((payload: any) => {
      this.selectedBeneficiary = payload;
      // this._getPerson();
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  // _getPerson() {
  //   if (this.user.userType.name === 'Beneficiary') {
  //       this._personService.find({ query: { email: this.user.email } }).then();

  //   } else {
  //     let person$ = Observable.fromPromise(
  //       this._personService.find({
  //         query: { _id: this.selectedBeneficiary.personId._id }
  //       })
  //     );
  //   }
  // }

  onClickCheckInput(value, isChecked) {
    if (isChecked) {
      this.selectedPreMedicalConditions.push(value.name);
    } else {
      this.selectedPreMedicalConditions = this.selectedPreMedicalConditions.filter(x => x !== value.name);
    }
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
}
