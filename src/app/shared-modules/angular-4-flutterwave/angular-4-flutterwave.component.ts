import { Component, OnInit, Output, Input, ElementRef } from '@angular/core';
import { FLUTTERWAVE_PUBLIC_KEY } from '../../services/globals/config';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';
import { FlutterwaveService, WindowRef } from '../../services/index';

@Component({
  selector: 'angular-4-flutterwave',
  templateUrl: './angular-4-flutterwave.component.html',
  styleUrls: ['./angular-4-flutterwave.component.scss']
})
export class Angular4FlutterwaveComponent implements OnInit {
  @Input() customer_email: string;
  @Input() amount: string;
  @Input() payment_method: string;
  @Input() currency: string;
  @Input() country: string;
  @Input() custom_logo: string;
  @Input() custom_description: string;
  @Input() custom_title: string;
  @Input() txref: string;
  @Input() PBFPubKey: string;
  @Input() exclude_banks: string;
  @Input() pay_button_text: string;
  @Input() onclose: any;
  @Input() callback: any;

  constructor(
    private _windowRef: WindowRef
  ) { }

  ngOnInit() {
  }

  setup() {
     console.log(this.customer_email);
    this._windowRef.nativeWindow.getpaidSetup({
      customer_email: this.customer_email,
      amount: this.amount,
      currency: this.currency,
      country: this.country,
      custom_logo: this.custom_logo,
      custom_description: this.custom_description,
      custom_title: this.custom_title,
      txref: this.txref,
      PBFPubKey: this.PBFPubKey,
      exclude_banks: this.exclude_banks,
      onclose: this.close,
      callback: this.onClickCallback
    });
  }

  onClickCallback(response) {
    console.log('This is the response returned after a charge', response);
    if (response.tx.chargeResponse === '00' || response.tx.chargeResponse === '0') {
      // redirect to a success page
    } else {
      // redirect to a failure page.
    }
  }

  close() {
    console.log('Flutterwave Close');
  }

}
