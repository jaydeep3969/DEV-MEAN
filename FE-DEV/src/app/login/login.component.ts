import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/services/user-management.service';
import { User } from 'src/models/user';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user : User = new User();
  reset_pswd : boolean = false;
  new_password : string = "";
  renew_password : string = "";

  
  constructor(private userManagementService : UserManagementService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {
  }

  signIn(){
    this.userManagementService.verifyUser(this.user)
      .subscribe(msg => {
        if(msg.message == 1){
          sessionStorage.setItem('uid', msg.uid);
          this.router.navigateByUrl('/home');
        }
        else if(msg.message == -1){
          this.notify('error','Error Message','Wrong Credentials !');
        }
        else if (msg.message == 0){
          sessionStorage.setItem('admin', '1');
          this.router.navigateByUrl('/admin');
        }
        else {
          this.notify('error','Error Message',msg.message);
          console.log(msg.message);
        }
      })
  }

  resetPassword() {
    let data = {
      username : this.user.username,
      password : this.user.password,
      new_password : this.new_password
    }

    this.userManagementService.resetPassword(data)
      .subscribe(msg => {
        if(msg.message == 1){
          this.notify('success','Success Message','Password Reset Successfull !');
          this.reset_pswd = false;
        }
        else if(msg.message == -1){
          this.notify('error','Error Message','Wrong Credentials !');
          console.log("Failure");
        }
        else
        {
          this.notify('error','Error Message',msg.message);
          console.log(msg.message);
        }
      })
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
