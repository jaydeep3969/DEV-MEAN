import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import { UserManagementService } from 'src/services/user-management.service';
import { User } from 'src/models/user';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user : User = new User();
  items: MenuItem[];
  activeItem : string = "dashboard";
  activeMenu : String = "stats";
  header : string = "Statistics";

  constructor(private router: Router,
              private messageService: MessageService,
              private userManagementService : UserManagementService) { }

  ngOnInit() {

    var uid = sessionStorage.getItem('uid');

    if(!uid)
    {
      this.router.navigateByUrl('/');
    }
    else 
    {
      this.userManagementService.getUser(uid)
        .subscribe(user => {
          this.user = user;
          this.notify('success','Login Successfull','Welcome '+ user.name + ' !');
        })
    }

    this.items = [
            {label: 'Dashboard', icon: 'fa fa-fw fa-bar-chart', command : (event) => {
              this.activeItem = "dashboard";
              this.openNav();
            }},
            {label: 'Items', icon: 'pi pi-list', command : (event) => {
              this.activeItem = "items";
            }},
            {label: 'Customers', icon: 'fa fa-fw fa-users', command : (event) => {
              this.activeItem = "customers";
            }},
            {label: 'Bills', icon: 'fa fa-fw fa-copy', command : (event) => {
              this.activeItem = "bills";
            }},
            {label: 'New Bill', icon: 'fa fa-fw fa-shopping-cart',command : (event) => {
              this.activeItem = "new_bill";
            }}
        ];
  
  }

  setFields() {
    if(this.activeMenu == 'collection')
    {
      this.header = "Collections";
    }
    else if(this.activeMenu == 'expense')
    {
      this.header = "Expenses";
    }
    else if(this.activeMenu == 'config')
    {
      this.header = "Configurations";
    }
    else if(this.activeMenu == 'stats')
    {
      this.header = "Statistics";
    }
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  clickNav(selected_menu : string) {
    this.activeMenu = selected_menu;
    this.closeNav();
    this.setFields();
    // if(selected_menu == 'collection')
    // {

    // }
    // else if(selected_menu == 'expense')
    // {

    // }
    // else if(selected_menu == 'config')
    // {

    // }
    // else if(selected_menu == 'stats')
    // {

    // }
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  logout() {
    this.closeNav();
    sessionStorage.removeItem('uid');
    let msg = {severity: 'success', summary: 'Success Message', detail: 'Logged out successfully !'}
    sessionStorage.setItem('msg', JSON.stringify(msg));
    this.router.navigateByUrl('/');
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }

}
