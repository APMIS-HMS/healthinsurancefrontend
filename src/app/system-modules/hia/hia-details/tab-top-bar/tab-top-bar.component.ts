import { Router } from '@angular/router';
import { SystemModuleService } from './../../../../services/common/system-module.service';
import { Facility } from './../../../../models/organisation/facility';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-top-bar',
  templateUrl: './tab-top-bar.component.html',
  styleUrls: ['./tab-top-bar.component.scss']
})
export class TabTopBarComponent implements OnInit {
  @Input() selectedFacility: Facility = <Facility>{};
  constructor(private _systemService:SystemModuleService,
  private _router:Router) { }

  ngOnInit() {
  }

  navigateEditHIA(hia) {
    this._systemService.on();
    this._router.navigate(['/modules/hia/new', hia._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }

}
