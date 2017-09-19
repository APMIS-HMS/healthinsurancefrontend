import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FamilyHealthCover } from '../../../models/setup/familyhealthcover';
import 'rxjs/Rx';

@Injectable()
export class FamilyHealthCoverService {
  public _socket;
  private _rest;
  public listner;
  public createlistner;
  public deletelistner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('familyhealthcovereds');
    this._socket = _socketService.getService('familyhealthcovereds');
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.deletelistner = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(familyhealthcover: FamilyHealthCover) {
    return this._socket.create(familyhealthcover);
  }
  update(familyhealthcover: FamilyHealthCover) {
    return this._socket.update(familyhealthcover._id, familyhealthcover);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}