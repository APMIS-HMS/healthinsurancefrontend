import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	signupFormGroup: FormGroup;
	signupBtnText: string = "SIGN UP &nbsp; <i class='fa fa-sign-in'></i>";
	constructor(
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.signupFormGroup = this.fb.group({
			name: ['', [<any>Validators.required]],
			email: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
	}

	onClickRegister(value: any, valid: boolean) {
		console.log(value);
		console.log(valid);
	}

}
