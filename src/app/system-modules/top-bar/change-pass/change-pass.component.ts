import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation} from '../../../services/common/password-validation';
import { AuthService } from '../../../auth/services/auth.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { User } from '../../../models/setup/user';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  changePassFormGroup: FormGroup;
  user: User= <User>{};

  constructor(private _fb: FormBuilder,
     private _authService: AuthService,
     private _locker: CoolLocalStorage) { }

  ngOnInit() {

    this.user = <any>this._locker.getItem('auth');
    console.log(this.user);
    this.changePassFormGroup = this._fb.group({
      email: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]],
    })
    //   cpassword: ['', [<any>Validators.required]]
		// }, {
    //   validator: PasswordValidation.MatchPassword
    // });
  }

  changePassword(value: any, valid: boolean) {
    // console.log(value);
    // this.user = <any>this._locker.getItem('auth');
    //  const getUserPassword = value.old_pass;
    
    // console.log(value);

    // console.log({email: this.user.email, password: getUserPassword});

    // const toCheck = {email: this.user.email, password: getUserPassword};
    this._authService.login(value)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log('Wrong user', err);
      });

    // this._authService.changePassword({password: value.password})
    //   .then((resetPwd) => {
    //     console.log(resetPwd);
    //   });
  // }

}
}
