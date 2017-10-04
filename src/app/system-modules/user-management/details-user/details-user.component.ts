import { SystemModuleService } from './../../../services/common/system-module.service';
import { UserService } from './../../../services/common/user.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent implements OnInit {

  listsearchControl = new FormControl();
  premiumsearchControl = new FormControl();
  isActive = new FormControl();

  tab_hias = true;
  selectedUser: any;

  constructor(private _route: ActivatedRoute, private _userService: UserService,
    private _systemService: SystemModuleService) { }

  ngOnInit() {
    this._route.params.subscribe(value => {
      console.log(value)
      if (value.id !== undefined) {
        this._getUser(value.id);
      }
    });
    this.isActive.valueChanges.subscribe(value => {
      this._updateUser(value);
    })
  }

  _updateUser(value) {
    this._systemService.on();
    this.selectedUser.isActive = value;
    this._userService.patch(this.selectedUser._id, this.selectedUser, {}).then((payload: any) => {
      this.selectedUser = payload;
      this.isActive.setValue(payload.isActive);
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  _getUser(id) {
    this._systemService.on();
    this._userService.get(id, {}).then((payload: any) => {
      this.selectedUser = payload;
      console.log(this.selectedUser)
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  tabHia_click() {
    this.tab_hias = true;
  }

}
