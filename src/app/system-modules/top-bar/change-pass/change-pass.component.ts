import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  changePassFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.changePassFormGroup = this._fb.group({
      old_pass: ['', [<any>Validators.required]],
      new_pass: ['', [<any>Validators.required]],
      confirm_pass: ['', [<any>Validators.required]]
		});
  }

}
