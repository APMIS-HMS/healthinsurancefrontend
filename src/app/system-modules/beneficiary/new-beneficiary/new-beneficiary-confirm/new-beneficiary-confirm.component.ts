import { PolicyService } from './../../../../services/policy/policy.service';
import { Observable } from 'rxjs/Rx';
import { JsonDataService } from './../../../../services/common/json-data.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-beneficiary-confirm',
  templateUrl: './new-beneficiary-confirm.component.html',
  styleUrls: ['./new-beneficiary-confirm.component.scss']
})
export class NewBeneficiaryConfirmComponent implements OnInit {
  @Input() policy: any;
  policyObject: any;
  constructor(private _dataService: JsonDataService,
    private _policyService: PolicyService) { }

  ngOnInit() {
    console.log(this.policy);
    // this.policyObject = this.policy;
    // this._dataService.getPolicy().subscribe((payload: any) => {
    //   this.policyObject = payload.policyObject;
    //   console.log(this.policyObject)
    // }, error => {
    //   console.log(error)
    // })

    this._policyService.get(this.policy._id, {}).then(payload => {
      this.policyObject = payload;
    }).catch(err => {
      console.log(err);
    })
  }

}
