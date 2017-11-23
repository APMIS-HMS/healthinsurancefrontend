import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Injectable()
export class ProviderGuard implements CanActivate {
  constructor(private locker: CoolLocalStorage, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const user = JSON.parse(this.locker.getItem('auth')).user;
      if (user.userType.name !== 'Platform Owner') {
        if (user.userType.name === 'Provider') {
          this.router.navigate(['/modules/provider/providers/' + user.facilityId._id]);
        }
        return false;
      } else {
        return true;
      }
  }
}
