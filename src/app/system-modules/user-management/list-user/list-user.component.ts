import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { CoolLocalStorage } from "angular2-cool-storage";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

import { environment } from "../../../../environments/environment";
import { FacilityService } from "../../../services/common/facility.service";

import { SystemModuleService } from "./../../../services/common/system-module.service";
import { UserService } from "./../../../services/common/user.service";
import { HeaderEventEmitterService } from "./../../../services/event-emitters/header-event-emitter.service";
import {
  CurrentPlaformShortName,
  TABLE_LIMIT_PER_VIEW
} from "./../../../services/globals/config";

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"]
})
export class ListUserComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl();
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl();
  addRoleForm: FormGroup;
  users: any = <any>[];
  cachedUsers: any = <any>[];
  roles: any = <any>[];
  loading: Boolean = true;
  closeResult: String;
  selectedUser: any = <any>{};
  auth: any = <any>{};
  currentPlatform: any;
  index: any = 0;
  totalEntries: number;
  showLoadMore: Boolean = true;
  limit: number = TABLE_LIMIT_PER_VIEW;
  resetData: Boolean;
  platformName: any;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _userService: UserService,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage
  ) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl("User List");
    this._headerEventEmitter.setMinorRouteUrl("List of all users");
    this.auth = (<any>this._locker.getObject("auth")).user;
    // console.log(this.auth);
    this._getCurrentPlatform();

    this.listsearchControl.valueChanges.subscribe(search => {
      this.loading = true;
      if (search.length > 2) {
        this.users = [];
        if (this.auth.userType === undefined) {
          const query = {
            $or: [
              { lastName: { $regex: search, $options: "i" } },
              { firstName: { $regex: search, $options: "i" } },
              { phoneNumber: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } }
            ]
          };
          this._userService
            .find(query)
            .then((res: any) => {
              this.loading = false;
              this.users = res.data;
              this._systemService.off();
            })
            .catch(err => {
              this._systemService.off();
            });
        } else if (this.auth.userType.name === "Platform Owner") {
          const query = {
            "platformOwnerId._id": this.currentPlatform._id,
            $or: [
              { lastName: { $regex: search, $options: "i" } },
              { firstName: { $regex: search, $options: "i" } },
              { phoneNumber: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } }
            ]
          };
          this._userService
            .find(query)
            .then((res: any) => {
              this.loading = false;
              this.users = res.data;
              this._systemService.off();
            })
            .catch(err => {
              this._systemService.off();
            });
        }
      } else {
        // If There is no search, replace the beneficiaries with the cached data.
        this.users = this.cachedUsers;
        this._systemService.off();
      }
    });
  }
  private _getCurrentPlatform() {
    this._facilityService
      .findWithOutAuth({ query: { shortName: this.platformName } })
      .then(res => {
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
          this._getUsers();
        } else if (this.auth.userType === undefined) {
          this._getUsers();
        }
      })
      .catch(err => console.log(err));
  }

  _getUsers() {
    this._systemService.on();
    if (this.auth.userType === undefined) {
      this._userService
        .find({ query: { $sort: { createdAt: -1 } } })
        .then((payload: any) => {
          this.loading = false;
          this.totalEntries = payload.total;
          // Array.prototype.push.apply(this.users,payload.data);
          if (this.resetData !== true) {
            this.users.push(...payload.data);
            this.cachedUsers.push(...payload.data);
          } else {
            this.resetData = false;
            this.users = payload.data;
            this.cachedUsers = payload.data;
          }
          if (this.totalEntries <= this.users.length) {
            this.showLoadMore = false;
          }
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    } else if (this.auth.userType.name === "Platform Owner") {
      this._userService
        .find({
          query: {
            "platformOwnerId._id": this.currentPlatform._id,
            $limit: this.limit,
            $skip: this.index * this.limit,
            $sort: { createdAt: -1 }
          }
        })
        .then((payload: any) => {
          this.loading = false;
          this.totalEntries = payload.total;
          // Array.prototype.push.apply(this.users,payload.data);
          if (this.resetData !== true) {
            this.users.push(...payload.data);
            this.cachedUsers.push(...payload.data);
          } else {
            this.resetData = false;
            this.users = payload.data;
            this.cachedUsers = payload.data;
          }
          if (this.totalEntries <= this.users.length) {
            this.showLoadMore = false;
          }
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    }

    this.index++;
  }

  navigateEditUser(user) {
    this._systemService.on();
    this._router
      .navigate(["/modules/user/new", user._id])
      .then(res => {
        this._systemService.off();
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  showDetails(user) {
    this._systemService.on();
    this._router
      .navigate(["/modules/user/users", user._id])
      .then(res => {
        this._systemService.off();
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on();
      this._router
        .navigate([url + id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    } else {
      this._systemService.on();
      this._router
        .navigate([url])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    }
  }

  loadMore() {
    this._getUsers();
  }

  reset() {
    this.index = 0;
    this.resetData = true;
    this._getUsers();
    this.showLoadMore = true;
  }
}
