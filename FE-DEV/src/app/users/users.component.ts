import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/services/user-management.service';
import { User } from 'src/models/user';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users : User[];
  new_user : User = new User();
  add_user : boolean = false;
  edit_user : boolean = false;
  cols : any[];
  repassword : string ="";

  constructor(private userManagementService : UserManagementService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {

    var admin = sessionStorage.getItem('admin');

    if(!admin)
    {
      this.router.navigateByUrl('/');
    }

    this.cols = [
      { field: 'name', header: 'Name', width : '17%' },
      { field: 'username', header: 'Username', width : '30%' }
    ];

    this.load_users();
  }

  load_users(){
    this.userManagementService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }

  addUser(){
    this.new_user = new User();
    this.add_user = true;
    this.repassword = "";
  }

  saveUser() {
    this.userManagementService.addUser(this.new_user)
      .subscribe(u => {
        this.load_users();
        this.add_user = false;
        this.notify('success','Success Message','New User is successfully added !');
      })
  }

  editUser(selected_user : User){
    this.new_user = selected_user;
    this.edit_user = true;
    this.new_user.password = "";
    this.repassword = "";
  }

  updateUser() {
    this.userManagementService.updateUser(this.new_user._id, this.new_user)
      .subscribe(u => {
        this.load_users();
        this.edit_user = false;
        this.notify('success','Success Message','User is updated successfully !');
      })
  }

  deleteUser(id : string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this user ?',
      accept: () => {
        this.userManagementService.deleteUser(id)
          .subscribe(msg => {  
              this.load_users();
              this.notify('success','Success Message','The user is successfully deleted !');
           });
      }
    });
  }

  logout(){
    sessionStorage.removeItem('admin');
    this.router.navigateByUrl('/');
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
