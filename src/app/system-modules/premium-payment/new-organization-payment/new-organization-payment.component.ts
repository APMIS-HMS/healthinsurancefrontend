import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
    private loadingService: LoadingBarService,
  ) { }

  ngOnInit() {
    this.organizationPayFormGroup = this._ipe.group({
      totalPremium: ['', [<any>Validators.required]]
    });

  }
  navigate(url: string, id: string) {
    if (!!id && id !== '') {
      this.loadingService.start();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.complete();
      }).catch(err => {
        this.loadingService.complete();
      });
    } else {
      this.loadingService.start();
      this._router.navigate([url]).then(res => {
        this.loadingService.complete();
      }).catch(err => {
        this.loadingService.complete();
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
