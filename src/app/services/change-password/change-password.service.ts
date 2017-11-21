import { SocketService, RestService } from "./../../feathers/feathers.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
const host = require("../../../app/feathers/feathers.service");
import "rxjs/Rx";
const request = require("superagent");

@Injectable()
export class ChangePasswordService {
  public _rest;
  public _socket;

  constructor(
    private _restService: RestService,
    private _socketService: SocketService
  ) {
    this._rest = _restService.getService("policies");
    this._socket = _socketService.getService("policies");
  }
  changePassWordService(value) {
    const path = host.HOST + "/api/compare-password";

    return new Promise((resolve, reject) => {
      resolve(
        this._socketService.authenticateUser("policies").then((result: any) => {
          return request.get(path).query(value);
        })
      );
    });
  }
}
