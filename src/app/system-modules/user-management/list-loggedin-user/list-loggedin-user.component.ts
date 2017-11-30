import { SystemModuleService } from './../../../services/common/system-module.service';
import { UserService } from './../../../services/common/user.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-loggedin-user',
  templateUrl: './list-loggedin-user.component.html',
  styleUrls: ['./list-loggedin-user.component.scss']
})
export class ListLoggedInUserComponent implements OnInit {

  onlineUsers = [];

  constructor(private _route: ActivatedRoute, private _userService: UserService,
    private _systemService: SystemModuleService, private _router: Router) {
    this._userService.listner.subscribe(payload => {
      this.onlineUsers = payload.filter(x => x.loggedInUserStatus.isLoggedIn === true);
    });
  }

  ngOnInit() {}
}
