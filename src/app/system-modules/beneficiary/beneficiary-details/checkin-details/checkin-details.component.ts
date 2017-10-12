import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-checkin-details',
  templateUrl: './checkin-details.component.html',
  styleUrls: ['./checkin-details.component.scss']
})
export class CheckinDetailsComponent implements OnInit {

  otpFormGroup: FormGroup;
  checkinFormGroup: FormGroup;

  otp_show = true;
  checkin_show = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.otpFormGroup = this._fb.group({
      patient: ['', [<any>Validators.required]],
      otp: ['', [<any>Validators.required]]
    });
    this.checkinFormGroup = this._fb.group({
      encounterType: ['', [<any>Validators.required]],
      encounterDate: ['', [<any>Validators.required]]
    });
  }

  otp_verify(){
    this.otp_show = false;
    this.checkin_show = true;
  }

}
