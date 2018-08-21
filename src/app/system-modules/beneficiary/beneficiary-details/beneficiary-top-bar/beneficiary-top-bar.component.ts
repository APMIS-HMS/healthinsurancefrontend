import { CoolLocalStorage } from 'angular2-cool-storage';
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
  canApprove = false;
  user: any;

  constructor(
    private _router: Router,
    private locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this.user = (<any>this.locker.getObject('auth')).user;
    if (!!this.user.userType && (this.user.userType.name === 'Platform Owner' || this.user.userType.name === 'Health Insurance Agent')) {
      this.canApprove = true;
    }
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
    } else {
      this.isCheckIn = false;
    }
  }

  addApprovalClick(e) {
    this.closeModal.emit(true);
  }
}
