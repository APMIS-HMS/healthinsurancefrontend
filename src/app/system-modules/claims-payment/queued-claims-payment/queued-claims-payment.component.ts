import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-queued-claims-payment',
  templateUrl: './queued-claims-payment.component.html',
  styleUrls: ['./queued-claims-payment.component.scss']
})
export class QueuedClaimsPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
