
import { Title } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ISubscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { SystemModuleService } from "./services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
  

export class AppComponent implements OnInit, OnDestroy {
  title = 'app works!';
  platformName: string;
  platformLogo: string;
  secondaryLogo: string;
  private sweetAlertSubscription: ISubscription;

  constructor(
    private systemModuleService: SystemModuleService,
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private titleService: Title
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.title = environment.title;
    this.titleService.setTitle(this.title);
    this.platformName = environment.platform;
    this.platformLogo = environment.logo;
    this.secondaryLogo = environment.secondary_logo;
  }

  ngOnInit() {
    this.sweetAlertSubscription = this.systemModuleService.sweetAnnounced$.subscribe((value: any) => {
      this._sweetNotification(value);
    });
  }

  _sweetNotification(value) {
    if (value.type === 'success') {
      swal({
        title: value.title,
        type: 'success',
        text: value.text,
        html: value.html,
        position: (value.position !== undefined && value.position !== null) ? value.position : 'top-end',
        showConfirmButton: (value.showConfirmButton !== undefined && value.showConfirmButton !== null) ? value.showConfirmButton : false,
        timer: (value.timer !== undefined && value.timer !== null) ? value.timer : 2000
      }).then(result => {
        if (value.cp !== undefined && value.cp !== null) {
          value.cp.sweetAlertCallback(result);
        }
      });
    } else if (value.type === 'error') {
      swal({
        title: value.title,
        type: 'error',
        text: value.text,
        html: value.html
      });
    } else if (value.type === 'info') {
      swal({
        title: value.title,
        type: 'info',
        text: value.text,
        html: value.html
      });
    } else if (value.type === 'warning') {
      swal({
        title: value.title,
        type: 'warning',
        text: value.text,
        html: value.html
      });
    } else if (value.type === 'question') {
      swal({
        title: value.title,
        text: value.text,
        type: value.type,
        html: value.html,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(result => {
        value.cp.sweetAlertCallback(result, value.from);
      });
    }
  }

  ngOnDestroy() {
    this.sweetAlertSubscription.unsubscribe();
  }
}
