import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SystemModuleService } from '../../../services/index';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-new-employee-payment',
  templateUrl: './new-organization-payment.component.html',
  styleUrls: ['./new-organization-payment.component.scss']
})
export class NewOrganizationPaymentComponent implements OnInit {
     organizationPayFormGroup: FormGroup;
     addOrganizationPay = false;
     addPaymentMode = false;

    public myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'dd-mmm-yyyy'
    };
    public today: IMyDate;

  constructor(
    private _ipe: FormBuilder,
    private _router: Router,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this.organizationPayFormGroup = this._ipe.group({
      totalPremium: ['', [<any>Validators.required]]
    });

  }
  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.off();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }


  modal_close() {
    this.addOrganizationPay = false;
    this.addPaymentMode = false;
  }
  addOrganizationPay_click() {
    this.addOrganizationPay = true;
  }

  addPaymentMode_click() {
    this.addPaymentMode = true;
  }
}
