import { Injectable } from '@angular/core';

@Injectable()
export class FlutterwaveService {
  chargeResponse: string = '';
  transactionRef: string = '';

  constructor() {
    this.transactionRef = 'FDKHGK' + Math.random();
  }


  getpaidSetup(payload: any) {

  }

  // getpaidSetup({
  //       customer_email: 'textaiwo@yahoo.com',// 
  //   amount: 1000,
  //   currency: 'NGN',
  //   country: 'NG',
  //   custom_logo: 'http://imgur.com/uuRnkV9',
  //   custom_description:'',
  //   custom_title: 'The Start',
  //   txref: trxref,
  //   PBFPubKey: pubkey,
  //   onclose: function (response) { },
  //   callback: function (response) {
  //     //flw_ref = response.tx.flwRef;
  //     console.log('This is the response returned after a charge', response);
  //     if (response.tx.chargeResponse == '00' || response.tx.chargeResponse == '0') {
  //       // redirect to a success page
  //     } else {
  //       // redirect to a failure page.
  //     }
  //   }
  //     });


}
