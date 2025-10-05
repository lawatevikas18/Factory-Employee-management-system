import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
userdtails:any
  constructor() { }

  setUserDetails(userDeatils:any){
    this.userdtails=userDeatils
  }
  geetUserDetails(){
    return this.userdtails
  }
}
