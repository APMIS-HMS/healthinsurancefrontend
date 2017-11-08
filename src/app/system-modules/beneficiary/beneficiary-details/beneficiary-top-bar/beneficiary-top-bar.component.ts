import { Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-beneficiary-top-bar',
  templateUrl: './beneficiary-top-bar.component.html',
  styleUrls: ['./beneficiary-top-bar.component.scss']
})
export class BeneficiaryTopBarComponent implements OnInit {
  @Input() policy: any = <any>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  isCheckIn = false;
  constructor(private _router: Router) { }

  ngOnInit() {
    if (this._router.url.endsWith('checkin')) {
      this.isCheckIn = true;
    } else if (this._router.url.endsWith('payment')) {
      this.isCheckIn = false;
    } else if (this._router.url.endsWith('claims')) {
      this.isCheckIn = false;
    } else if (this._router.url.endsWith('checkedin-history')) {
      this.isCheckIn = true;
    } else if (this._router.url.endsWith('referrals')) {
      this.isCheckIn = false;
    }
    else {
      this.isCheckIn = false;
    }
  }

  addApprovalClick(e) {
    this.closeModal.emit(true);
  }
}
