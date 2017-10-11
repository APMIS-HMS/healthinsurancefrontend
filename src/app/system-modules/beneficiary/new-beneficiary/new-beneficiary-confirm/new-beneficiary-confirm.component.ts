import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-beneficiary-confirm',
  templateUrl: './new-beneficiary-confirm.component.html',
  styleUrls: ['./new-beneficiary-confirm.component.scss']
})
export class NewBeneficiaryConfirmComponent implements OnInit {
  @Input() selectedBeneficiary: any;
  @Input() dependants: any[];
  @Input() policy: any;
  constructor() { }

  ngOnInit() {
  }

}
