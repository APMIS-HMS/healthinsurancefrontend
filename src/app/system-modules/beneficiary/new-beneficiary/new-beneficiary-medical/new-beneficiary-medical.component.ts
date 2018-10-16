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

    this.populateForm();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      }
    });
  }

  populateForm(selectedBeneficiary?) {
    if (!!selectedBeneficiary) {
      const bloodGroup = selectedBeneficiary.personId.medical ? selectedBeneficiary.personId.medical.bloodGroup : '';
      const genotype = selectedBeneficiary.personId.medical ? selectedBeneficiary.personId.medical.genotype : '';
      const otherPreMed = selectedBeneficiary.personId.medical ? selectedBeneficiary.personId.medical.otherPreMedicalCondition : '';
      this.medicalFormGroup = this._fb.group({
        bloodGroup: [bloodGroup, [<any>Validators.required]],
        genotype: [genotype, [<any>Validators.required]],
        otherPreMed: [otherPreMed],
      });
    } else {
      this.medicalFormGroup = this._fb.group({
        bloodGroup: [, [<any>Validators.required]],
        genotype: ['', [<any>Validators.required]],
        otherPreMed: [''],
      });
    }
  }

  onClickStepThree(valid, value) {
    if (valid) {
      this._systemService.on();
      const payload = {
        personId: this.selectedBeneficiary.personId._id,
        medical: {
          bloodGroup: value.bloodGroup,
          genotype: value.genotype,
          preMedicalConditions: this.selectedPreMedicalConditions,
          otherPreMedicalCondition: value.otherPreMed,
        }
      };

      this._beneficiaryService.saveBeneficiaryMedical(payload).then(res => {
        this._systemService.off();
        if (res.statusCode === 200 && res.error === false) {
          if (this.selectedBeneficiary.numberOfUnderAge > 0) {
            this._router.navigate(['/modules/beneficiary/new/dependants', this.selectedBeneficiary._id]).then(payload => {
              // Route to dependant
            }).catch(err => {});
          } else {
            this._router.navigate(['/modules/beneficiary/new/next-of-kin', this.selectedBeneficiary._id]).then(payload => {
              // Route to next of kin
            }).catch(err => {});
          }
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
    }).catch(err => { console.log(err)});
  }

  _getBeneficiary(beneficiaryId) {
    this._systemService.on();
    this._beneficiaryService.get(beneficiaryId, {}).then((res: any) => {
      this.selectedBeneficiary = res;
      this.populateForm(res);
      this.selectedPreMedicalConditions = !!res.personId.medical ? res.personId.medical.preMedicalConditions : [];
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  onClickCheckInput(value, isChecked) {
    if (isChecked) {
      this.selectedPreMedicalConditions.push(value.name);
    } else {
      this.selectedPreMedicalConditions = this.selectedPreMedicalConditions.filter(x => x !== value.name);
    }
  }

  checkMedicalCondition(preMedicalCondition) {
    const check = this.selectedPreMedicalConditions.filter(x => x === preMedicalCondition.name);
    if (check.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1 === l2;
    }
    return false;
  }

  compare2(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1 === l2;
    }
    return false;
  }
}
