import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-referal',
  templateUrl: './new-referal.component.html',
  styleUrls: ['./new-referal.component.scss']
})
export class NewReferalComponent implements OnInit {

  referalFormGroup: FormGroup;
  searchResults = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private loadingService: LoadingBarService,
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Referral');
    this._headerEventEmitter.setMinorRouteUrl('Create new referral');

    this.referalFormGroup = this._fb.group({
      patientName: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      age: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      referingHospital: ['', [<any>Validators.required]],
      destinationHospital: ['', [<any>Validators.required]],
      visitClass: ['', [<any>Validators.required]],
      hiaResponsible: ['', [<any>Validators.required]],
      referalName: ['', [<any>Validators.required]],
      referingLashmaId: ['', [<any>Validators.required]],
      referalDate: ['', [<any>Validators.required]],
      outPatient: ['', [<any>Validators.required]],
      inPatient: ['', [<any>Validators.required]],
      admissionDate: ['', [<any>Validators.required]],
      dischargeDate: ['', [<any>Validators.required]],
      visitDate: ['', [<any>Validators.required]],
      complaint: ['', [<any>Validators.required]],
      complaintDuration: ['', [<any>Validators.required]],
      complaintUnit: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]],
      procedure: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      drugQty: ['', [<any>Validators.required]],
      drugUnit: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      doctor: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]]
    });
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

}
