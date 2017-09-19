import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PersonService {
  public _socket;
  public createListener;
  public updateListener;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('people');
    this._socket = _socketService.getService('people');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.updateListener = Observable.fromEvent(this._socket, 'updated');
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

  create(person: any) {
    return this._socket.create(person);
  }
  update(person: any) {
    return this._socket.update(person._id, person);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}