import { PolicyService } from "./../../services/policy/policy.service";
import { Observable } from "rxjs/Rx";
import { PersonService } from "./../../services/person/person.service";
import { BeneficiaryService } from "./../../services/beneficiary/beneficiary.service";
import { RoleService } from "./../../services/auth/role/role.service";
import { CoolLocalStorage } from "angular2-cool-storage";
import { UserTypeService } from "./../../services/common/user-type.service";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  showLoginTab: Boolean = false;
  showRegTab: Boolean = false;
  loginFormGroup: FormGroup;
  loginBtnText: boolean = true;
  loginBtnProcessing: boolean = false;
  disableBtn: boolean = false;
  user: any;

  constructor(
    private _toastr: ToastsManager,
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _locker: CoolLocalStorage,
    private _roleService: RoleService,
    private _beneficiaryService: BeneficiaryService,
    private _personService: PersonService,
    private _policyService: PolicyService
  ) {}

  ngOnInit() {
    this.loginFormGroup = this._fb.group({
      email: [
        "",
        [<any>Validators.pattern(EMAIL_REGEX), <any>Validators.required]
      ],
      password: ["", [<any>Validators.required]]
    });

    this._authService.logOut();
  }

  setLoggedInUser(email: String, loggInState: boolean) {
    this._authService.find({ query: { email: email } }).then(payload => {
      let currentUser = payload.data[0];
      currentUser.loggedInUserStatus = {
        isLoggedIn: loggInState
      };
      this._authService.patch(currentUser._id, currentUser, {});
    });
  }
  private _checkRole() {
    try {
      const roles = this.user.roles;
      console.log(roles);
      const roleIds: any[] = [];
      roles.forEach(x => {
        roleIds.push(x._id);
      });

      this._roleService
        .find({
          query: {
            _id: {
              $in: roleIds
            }
          }
        })
        .then((pays: any) => {
          pays.data.forEach(roleItem => {
            if (!!roleItem.accessibilities) {
              const accessibilities = roleItem.accessibilities;
              this._locker.setObject("accessibilities", accessibilities);
            }
            this.setLoggedInUser(
              this.loginFormGroup.controls["email"].value,
              true
            );
            this.loginBtnText = true;
            this.loginBtnProcessing = false;
            this.disableBtn = false;
            this._router.navigate(["/modules/welcome"]).then(res => {
              this._authService.announceMission({ status: "On" });
              this._toastr.success(
                "You have successfully logged in!",
                "Success!"
              );
            });
          });
        })
        .catch(err => {});
    } catch (error) {}
  }

  _getPerson() {
    let beneficiary$ = Observable.fromPromise(
      this._beneficiaryService.find({
        query: {
          "personId.email": this.user.email
        }
      })
    );
    Observable.forkJoin([beneficiary$]).subscribe(
      (results: any) => {
        console.log(results);
        if (results[0].data.length > 0) {
          console.log("redirect to last page");
          console.log(results[0].data[0]._id);
          this._policyService
            .find({
              query: {
                principalBeneficiary: results[0].data[0]._id
              }
            })
            .then((policies: any) => {
              console.log(policies);
              if (policies.data.length > 0) {
                if ((this.user.userType.name = "Beneficiary")) {
                  if (this.user.roles.length === 0) {
                    this._router
                      .navigate([
                        "/modules/beneficiary/new/complete",
                        policies.data[0]._id
                      ])
                      .then(payload => {})
                      .catch(err => {
                        console.log(err);
                      });
                  } else {
                    this._router
                      .navigate([
                        "/modules/beneficiary/beneficiaries",
                        policies.data[0]._id
                      ])
                      .then(payload => {})
                      .catch(err => {
                        console.log(err);
                      });
                  }
                }
              } else {
                this._router
                  .navigate(["/modules/beneficiary/new/principal"])
                  .then(payload => {})
                  .catch(err => {
                    console.log(err);
                  });
              }
            })
            .catch(errin => {
              console.log(errin);
            });
        } else {
          this._router
            .navigate(["/modules/beneficiary/new/principal"])
            .then(payload => {})
            .catch(err => {
              console.log(err);
            });
        }
      },
      error => {
        console.log(error);
      }
    );
    // this._personService.find({
    //   query: {
    //     email: this.user.email
    //   }
    // }).then((payload: any) => {
    //   if (payload.data.length > 0) {
    //     this._beneficiaryService.find({query:{
    //       'personId.email':this.user.email
    //     }})
    //     this.person = payload.data[0];
    //     this.stepOneFormGroup.controls.mothermaidenname.setValue(this.person.mothersMaidenName);
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  onClickLogin(value: any, valid: boolean) {
    if (valid) {
      this.loginBtnText = false;
      this.loginBtnProcessing = true;
      this.disableBtn = true;

      console.log(value);

      this._authService
        .login(value)
        .then(payload => {
          this._locker.setObject("auth", payload);
          console.log(payload);
          if (
            payload.user !== undefined &&
            payload.user.roles !== undefined &&
            payload.user.roles.length > 0
          ) {
            this.user = payload.user;
            this._checkRole();
          } else {
            console.log(payload);
            if (
              payload.user !== undefined &&
              payload.user.userType !== undefined
            ) {
              this.user = payload.user;
              if (this.user.userType.name === "Beneficiary") {
                this._getPerson();
              } else {
                this._router.navigate(["/modules/welcome"]).then(res => {
                  this._authService.announceMission({ status: "On" });
                  this._toastr.success(
                    "You have successfully logged in!",
                    "Success!"
                  );
                });
              }
            } else {
              this.loginBtnText = true;
              this.loginBtnProcessing = false;
              this.disableBtn = false;
              this._authService.logOut();
              this.onClickLogin(value, valid);
            }
          }
        })
        .catch(err => {
          console.log(err);
          this._toastr.error("Invalid email or password!", "Error!");
          this.loginFormGroup.controls["password"].reset();
          this.loginBtnText = true;
          this.loginBtnProcessing = false;
          this.disableBtn = false;
        });
    } else {
      this._toastr.error(
        "Please fill in the required fields!",
        "Form Validation Error!"
      );
    }
    value = { email: "", password: "" };
  }

  onClickTab(tab) {
    if (tab === "login") {
      this.showLoginTab = !this.showLoginTab;
    } else {
      this.showRegTab = !this.showRegTab;
    }
  }
}
