import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-claims-payment',
  templateUrl: './list-claims-payment.component.html',
  styleUrls: ['./list-claims-payment.component.scss']
})
export class ListClaimsPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
