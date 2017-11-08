import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ReferralAuthorization } from '../../../../models/referral/referral';

@Component({
  selector: 'app-referal-top-bar',
  templateUrl: './referal-top-bar.component.html',
  styleUrls: ['./referal-top-bar.component.scss']
})
export class ReferalTopBarComponent implements OnInit {
  @Input() selectedAuthorization: ReferralAuthorization;
  constructor(private _router: Router) { }

  ngOnInit() {
    console.log(this.selectedAuthorization)
  }

  editReferral() {
    this._router.navigate(['/modules/referal/view', this.selectedAuthorization._id]).then(payload => {

    }).catch(err => {
      console.log(err)
    });
  }
}
