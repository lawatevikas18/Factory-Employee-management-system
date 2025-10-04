import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
   

    //  get user name
   private userNameSource = new BehaviorSubject<string>(localStorage.getItem('userName') || '');
  userName$ = this.userNameSource.asObservable();

  setUserName(name: string) {
    localStorage.setItem('userName', name);
    this.userNameSource.next(name);
  }


}
