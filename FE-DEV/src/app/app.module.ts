import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Added by JD
import {TabMenuModule} from 'primeng/tabmenu';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SidebarModule} from 'primeng/sidebar';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ChartModule} from 'primeng/chart';
import {DropdownModule} from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {MenuModule} from 'primeng/menu';
import {MatMenuModule} from '@angular/material/menu';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ItemsComponent } from './items/items.component';
import { NewBillComponent } from './new-bill/new-bill.component';
import { CustomersComponent } from './customers/customers.component';
import { PreviewClothBillComponent } from './previews/preview-cloth-bill/preview-cloth-bill.component';
import { PreviewElectronicBillComponent } from './previews/preview-electronic-bill/preview-electronic-bill.component';
import { PreviewAutomobileBillComponent } from './previews/preview-automobile-bill/preview-automobile-bill.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ConfigsComponent } from './configs/configs.component';
import { BillsComponent } from './bills/bills.component';
import { CollectionsComponent } from './collections/collections.component';
import { LoginComponent } from './login/login.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';


const appRoutes: Routes = [
  { path : '', component : LoginComponent },
  { path: 'home', component: NavBarComponent },
  { path: 'admin', component: UsersComponent },
  { path: 'preview-cloth-bill/:id', component: PreviewClothBillComponent },
  { path: 'preview-ele-bill/:id', component: PreviewElectronicBillComponent },
  { path: 'preview-auto-bill/:id', component: PreviewAutomobileBillComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ItemsComponent,
    NewBillComponent,
    CustomersComponent,
    PreviewClothBillComponent,
    PreviewElectronicBillComponent,
    PreviewAutomobileBillComponent,
    ExpensesComponent,
    ConfigsComponent,
    BillsComponent,
    CollectionsComponent,
    LoginComponent,
    StatisticsComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    RadioButtonModule,
    SidebarModule,
    MessageModule,
    ToastModule,
    CardModule,
    StepsModule,
    InputTextModule,
    CalendarModule,
    InputSwitchModule,
    ChartModule,
    DropdownModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    HttpClientModule,
    RouterModule,
    TabMenuModule,
    MenuModule,
    MatMenuModule,
    RouterModule.forRoot(
      appRoutes//,
      //{enableTracing : true} //for debugging purpose
    )
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
