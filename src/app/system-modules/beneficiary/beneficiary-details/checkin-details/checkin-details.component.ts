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
  checkedinFormGroup: FormGroup;

  otp_show = true;
  checkin_show = false;
  otp_generated = false;
  checkinSect = true;
  checkedinSect = false;

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
    this.checkedinFormGroup = this._fb.group({
      encounterType: ['', [<any>Validators.required]],
      encounterDate: ['', [<any>Validators.required]],
      encounterStatus: ['', [<any>Validators.required]]
    });
  }

  otp_verify(){
    this.otp_show = false;
    this.checkin_show = true;
  }
  ok_click(){
    this.otp_generated = false;
  }
  generate_otp(){
    this.otp_generated = true;
  }
  checkin_click(){
    this.checkinSect = false;
    this.checkedinSect = true;
  }

}
