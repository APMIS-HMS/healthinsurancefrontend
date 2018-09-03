import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  tabActive: Boolean = false;
  tabId: String = "";

  title = "";
  platformName: string;
  platformLogo: string;
  secondaryLogo: string;
  backgroundColor: string;

  constructor(private _router: Router, private titleService: Title) {
    this.title = environment.title;
    this.titleService.setTitle(this.title);
    this.platformName = environment.platform;
    this.platformLogo = environment.logo;
    this.secondaryLogo = environment.secondary_logo;
    this.backgroundColor = environment.background_color;
  }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }

  onClickTab(tab) {
    this.tabActive = true;
    if (tab === "login") {
      this.tabId = "login";
    } else if (tab === "register") {
      this.tabId = "register";
    }
  }
  private checkPageUrl(param: string) {
    this.tabActive = true;
    if (param.includes("login")) {
      this.tabId = "login";
    } else {
      this.tabId = "register";
    }
  }
}
