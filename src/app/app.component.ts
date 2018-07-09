import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app works!";
  platformName: string;
  platformLogo: string;
  secondaryLogo: string;
  constructor(
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

  ngOnInit() {}
}
