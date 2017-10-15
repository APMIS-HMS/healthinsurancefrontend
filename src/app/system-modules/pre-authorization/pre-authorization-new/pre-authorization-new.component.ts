import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-pre-authorization-new',
  templateUrl: './pre-authorization-new.component.html',
  styleUrls: ['./pre-authorization-new.component.scss']
})
export class PreAuthorizationNewComponent implements OnInit {

  preAuthFormGroup: FormGroup;
  searchResults = false;
  Disabled = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(private _pa: FormBuilder) { }

  ngOnInit() {
    this.preAuthFormGroup = this._pa.group({
      patientName: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      age: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      healthCareProvider: ['', [<any>Validators.required]],
      hia: ['', [<any>Validators.required]],
      visitClass: ['', [<any>Validators.required]],
      requestDate: ['', [<any>Validators.required]],
      requestTime: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]],
      emergency: ['', [<any>Validators.required]],
      presentingComplaints: ['', [<any>Validators.required]],
      complaintsDuration: ['', [<any>Validators.required]],
      complaintsUnit: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]],
      procedures: ['', [<any>Validators.required]],
      requestReason: ['', [<any>Validators.required]],
      services: ['', [<any>Validators.required]],
      preAuthorizationNote: ['', [<any>Validators.required]],
      docName: ['', [<any>Validators.required]]
      
    });
  }

}
