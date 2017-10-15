import { SystemModuleService } from './../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ModuleService, RoleService } from '../../services/index';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent implements OnInit {
  accessFormGroup: FormGroup;
  listsearchControl = new FormControl();
  modules: any = <any>[];
  accesses: any = <any>[];
  moduleAccesses: any[] = [];
  disableAddAccessBtn: boolean = false;
  addAccessBtnText: String = '<i class="fa fa-plus"></i> ADD';
  selectedModule: any;

  constructor(
    private _fb: FormBuilder,
    private _roleService: RoleService,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _moduleService: ModuleService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Manage Accessibilities');
    this._headerEventEmitter.setMinorRouteUrl('List of all accessibilities');
    this._getModules();
    this._getRoles();

    this.accessFormGroup = this._fb.group({
      module: ['', [<any>Validators.required]],
      accessibility: ['', [<any>Validators.required]]
    });

    this.accessFormGroup.controls['module'].valueChanges.subscribe(value => {
      this.selectedModule = value;
      this.accessFormGroup.controls['accessibility'].reset();
    })

  }


  onClickAddAccess(valid: Boolean, value: any) {
    if (valid) {
      console.log(value);
      this._systemService.on();
      if (this.selectedModule.accessibilities === undefined) {
        this.selectedModule.accessibilities = [];
      }
      this.selectedModule.accessibilities.push({ name: value.accessibility });
      console.log(this.selectedModule)
      this._moduleService.update(this.selectedModule).then(res => {
        console.log(res);
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    } else {
      this._toastr.error('Some fields are empty', 'Error!');
    }
  }

  private _getModules() {
    this._moduleService.find({ query: { $limit: 100, $sort: 'name' } }).then((res: any) => {
      this.modules = res.data;
    }).catch(err => console.log(err));
  }

  private _getRoles() {
    this._roleService.find({}).then((res: any) => {
      this.accesses = res.data;
    }).catch(err => console.log(err));
  }
}
