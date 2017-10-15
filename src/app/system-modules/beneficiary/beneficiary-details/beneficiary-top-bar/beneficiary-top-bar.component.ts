import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-beneficiary-top-bar',
  templateUrl: './beneficiary-top-bar.component.html',
  styleUrls: ['./beneficiary-top-bar.component.scss']
})
export class BeneficiaryTopBarComponent implements OnInit {
  @Input() policy: any = <any>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    console.log(this.policy);
  }

  addApprovalClick(e) {
    this.closeModal.emit(true);
  }
}
