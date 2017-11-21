import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { PasswordValidation } from "../../../services/common/password-validation";
import { AuthService } from "../../../auth/services/auth.service";
import { CoolLocalStorage } from "angular2-cool-storage";
import { User } from "../../../models/setup/user";
import { Injectable } from "@angular/core";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { Router } from "@angular/router";

const host = require("../../../feathers/feathers.service");
const feathers = require("feathers/client");
const socketio = require("feathers-socketio/client");
const io = require("socket.io-client");
const hooks = require("feathers-hooks");
const rest = require("feathers-rest/client");
const rx = require("feathers-reactive");
const RxJS = require("rxjs");
const authentication = require("feathers-authentication-client");

@Injectable()
export class ChangePasswordSocketService {
  public socket: any;
  public _app: any;

  constructor() {
    this.socket = io(host.HOST);
    this._app = feathers()
      .configure(socketio(this.socket))
      .configure(rx(RxJS, { listStrategy: "always" }))
      .configure(hooks())
      .configure(authentication({ storage: window.sessionStorage }));
  }
  chLoginIntoApp(query: any) {
    return this._app.authenticate({
      strategy: "local",
      email: query.email,
      password: query.password
    });
  }
}

// password RvnYUv4i

@Injectable()
export class ChangePasswordAuthService {
  _chSocket;
  constructor(private _chSocketService: ChangePasswordSocketService) {}

  chLogin(query: any) {
    return this._chSocketService.chLoginIntoApp(query);
  }
}

@Component({
  selector: "app-change-pass",
  templateUrl: "./change-pass.component.html",
  styleUrls: ["./change-pass.component.scss"]
})
export class ChangePassComponent implements OnInit {
  changePassFormGroup: FormGroup;
  user: User = <User>{};
  _app: any;
  constructor(
    private _fb: FormBuilder,
    private _chAuthService: ChangePasswordAuthService,
    private _locker: CoolLocalStorage,
    private _authService: AuthService,
    private _router: Router,
    private _toastr: ToastsManager
  ) {}

  ngOnInit() {
    this.user = <any>this._locker.getItem("auth");
    this.changePassFormGroup = this._fb.group(
      {
        old_pass: ["", [<any>Validators.required]],
        password: ["", [<any>Validators.required]],
        cpassword: ["", [<any>Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  changePassword(value: any, valid: boolean) {
    this.user = JSON.parse(<any>this._locker.getItem("auth")).user;
    const getUserPassword = value.old_pass,
      userId = this.user._id;

    const toCheck = { email: this.user.email, password: getUserPassword };
    return this._chAuthService
      .chLogin(toCheck)
      .then(logindetails => {
        return logindetails;
      })
      .then(result => {
        // RvnYUv4i
        const newpwd = { password: value.cpassword };
        this._authService
          .patch(userId, newpwd, {})
          .then(updatedPwd => {
            this._toastr.success(
              "Password was successfully changed",
              "Success!"
            ).then(e =>{
              console.log(e)
            })
            .catch(err =>{
              console.log(err)
            });
            setTimeout(() => {
              this._authService.logOut().then(res => {
                this._router.navigate(["/auth/login"]);
              });
            }, 3000);
          })
          .catch(err => {
            console.log(1)
            this._toastr.error("Unable to change password", "Error!");
          });
      })
      .catch(err => {
        console.log(2)
        console.log(this._toastr);
        this._toastr.error("Wrong Password", "Error!");
      });
  }
}
