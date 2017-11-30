import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
let request = require('superagent');
@Injectable()
export class UserService {
    public _socket;
    public _changePasswordRest;
    private _rest;
    private _restLogin;
    isLoggedIn = false;
    private missionAnnouncedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    constructor(
        private _socketService: SocketService,
        private _restService: RestService
    ) {
        this._rest = _restService.getService('users');
        this._changePasswordRest = _restService.getService('changepassword');
        this._socket = _socketService.getService('users');
        this._socket.timeout = 30000;
        this._restLogin = _restService.getService('auth/local');
        this._socket.on('created', function (user) {
        });
    }
    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }

    logOut() {
        this._socketService.logOut();
    }
    login(query: any) {
        return this._socketService.loginIntoApp(query);
        //return this._restLogin.create(query);
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

    create(user: any) {
        return this._socket.create(user);
    }

    update(user: any) {
        return this._socket.update(user._id, user);
    }

    patch(_id: any, data: any, param: any) {
        return this._socket.patch(_id, data, param);
    }
    remove(id: string, query: any) {
        return this._socket.remove(id, query);
    }
    changePassword(body: any) {
        let host = this._restService.getHost();
        let path = host + '/changepassword';
        return request
            .post(path)
            .send(body);
    }
    resetPassword(body: any) {
        let host = this._restService.getHost();
        let path = host + '/passwordreset';
        return request
            .post(path)
            .send(body);
    }

}