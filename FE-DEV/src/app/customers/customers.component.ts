import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CustomerCloth } from 'src/models/customers/customer-cloth';
import { CustomerElectronic } from 'src/models/customers/customer-electronic';
import { CustomerManagementService } from 'src/services/customer-management.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Table } from 'primeng/table';
import { BillsManagementService } from 'src/services/bills-management.service';
import { CustomerAutomobile } from 'src/models/customers/customer-automobile';
import { Deposite } from 'src/models/deposite';
import { BillElectronics } from 'src/models/bills/bill-electronics';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, AfterViewChecked {

  @ViewChild('billTable') private _billTable: Table;
  @ViewChild('depositeTable') private _depositeTable: Table;

  selected_cust_type : string;
  cols_cust : any[];
  cols_bill : any[];
  add_cust : boolean = false;
  edit_cust : boolean = false;
  new_cust : any;
  customers : any[];
  bill_id : string = "";
  bill_type : string;
  new_deposite : Deposite = new Deposite();
  add_deposite : boolean = false;
  selected_bill : any = new BillElectronics();
  
  dateFilters: any;
  depositeDateFilters : any;
  dueDateFilters : any;

  cols_deposite = [
    { field: 'date', header: 'Date', width : '60%' },
    { field: 'amount', header: 'Amount', width : '60%' },
    { field: 'name', header: 'Person Name', width : '60%' }
  ];

  constructor(private customerManagementService : CustomerManagementService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private billsManagementService : BillsManagementService) { }

  ngOnInit() {
    this.selected_cust_type = 'customer_cloth';
    this.new_cust = new CustomerCloth();

    this.set_config();
  }

  ngAfterViewChecked(){
    //  var _self = this;
    // this will be called from your templates onSelect event

    if(this._billTable != undefined)
    {
      const customFilterConstraints = this._billTable.filterConstraints;
      customFilterConstraints['between'] = this.dateRangeFilter;
      this._billTable.filterConstraints = customFilterConstraints;
    }

    if(this._depositeTable != undefined)
    {
      const customFilterConstraints = this._depositeTable.filterConstraints;
      customFilterConstraints['between'] = this.dateRangeFilter;
      this._depositeTable.filterConstraints = customFilterConstraints;
    }
    
  }


  dateRangeFilter(value: Date, filter:Date[]): boolean {
    // get the from/start value

    value = new Date(value);
    
    var s = filter[0].getTime();
    var e;
    
    // the to/end value might not be set
    // use the from/start date and add 1 dayx
    // or the to/end date and add 1 day
    if ( filter[1]) {
      e =  filter[1].getTime() + 86400000;
    } else {
      e = s + 86400000;
    }
    // compare it to the actual values
    return (value.getTime() >= s && value.getTime() <= e);
  }

  // onSelectDate(table : any, colField : any, colFiletrMatchMode : any){
  //   this._table.filter(this.dateFilters, colField, colFiletrMatchMode);
  // }

  set_config(){
    this.set_data();
    this.set_cols();
  }

  set_cols(){
    if(this.selected_cust_type == "customer_cloth"){
      this.cols_cust = [
        { field: 'name', header: 'Customer Name', width : '60%' },
        { field: 'contact', header: 'Contact', width : '15%' }
      ];

      this.cols_bill = [
        { field : 'invoice_no_cloth', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '20%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '23%' },
        { field : 'due_date', header : 'Due Date', width : '20%' },
      ];

      this.bill_type = "bill_cloth";
    }
    else if(this.selected_cust_type == "customer_electronic"){
      this.cols_cust = [
        { field: 'name', header: 'Customer Name', width : '60%' },
        { field: 'contact', header: 'Contact', width : '15%' },
        { field: 'due_amount', header : 'Due Amount', width : '15%'}
      ];

      this.cols_bill = [
        { field : 'invoice_no_ele', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '12%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '20%' },
        { field : 'due_amount', header : 'Due Amount', width : '20%' },
      ];

      this.bill_type = "bill_electronic";
    }
    else if(this.selected_cust_type == "customer_automobile"){
      this.cols_cust = [
        { field: 'name', header: 'Customer Name', width : '60%' },
        { field: 'contact', header: 'Contact', width : '15%' }
      ];

      this.cols_bill = [
        { field : 'invoice_no_auto', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '20%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '22%' }
      ];

      this.bill_type = "bill_automobile";
    }
  }

  set_data(){
    this.customerManagementService.getCustomers(this.selected_cust_type)
      .subscribe(customers => {
        if(this.selected_cust_type == "customer_cloth")
          this.customers = customers as CustomerCloth[];
        else if(this.selected_cust_type == "customer_electronic")
          this.customers = customers as CustomerElectronic[];
        else if(this.selected_cust_type == "customer_automobile"){
          this.customers = customers as CustomerAutomobile[];
        }
      })
  }

  addCustomer(){
    this.add_cust = true;
    if(this.selected_cust_type == "customer_cloth"){
      this.new_cust = new CustomerCloth();
    }
    else if(this.selected_cust_type == "customer_electronic"){
      this.new_cust = new CustomerElectronic();
    }
    else if(this.selected_cust_type == "customer_automobile"){
      this.new_cust = new CustomerAutomobile();
    }
  }

  saveCustomer(){
    this.customerManagementService.addCustomer(this.selected_cust_type, this.new_cust)
      .subscribe(customer => {
        this.set_data();
        this.add_cust = false;
        this.notify('success','Success Message','New Customer is successfully added !');
      })
  }

  editCustomer(id : string){
    this.customerManagementService.getCustomer(this.selected_cust_type, id)
      .subscribe(customer => {
        this.edit_cust = true;
        if(this.selected_cust_type == "customer_cloth")
          this.new_cust = customer as CustomerCloth;
        else if(this.selected_cust_type == "customer_electronic")
          this.new_cust = customer as CustomerElectronic;
        else if(this.selected_cust_type == "customer_automobile"){
          this.new_cust = customer as CustomerAutomobile;
        }
        
      })
  }

  updateCustomer(id : string){
    this.customerManagementService.updateCustomer(this.selected_cust_type, id, this.new_cust)
      .subscribe(customer => {
        this.set_data();
        this.edit_cust = false;
        this.notify('success','Success Message','The customer is successfully updated !');
      })
  }

  deleteCustomer(id : string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this customer ?',
      accept : () => {
        this.customerManagementService.deleteCustomer(this.selected_cust_type, id)
          .subscribe(customer => {
            this.set_data();
            this.notify('success','Success Message','The Customer is successfully deleted !');
          });
      }
    });
  }

  viewBill(bill_id : string){
    if(this.selected_cust_type == 'customer_cloth')
      window.open("/preview-cloth-bill/"+bill_id,"_blank");
    else if(this.selected_cust_type == 'customer_electronic')
      window.open("/preview-ele-bill/"+bill_id,"_blank");
    else if(this.selected_cust_type == 'customer_automobile')
      window.open("/preview-auto-bill/"+bill_id,"_blank");
  }

  deleteBill(bill_id : string){

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this bill ?',
      accept : () => {
        this.billsManagementService.deleteBill(this.bill_type, bill_id)
          .subscribe(() => {
            console.log("Bill Successfully Deleted !");
            this.notify('success','Success Message','Bill is successfully deleted !');
            this.set_data();
          });
      }
    });

    
  }

  addDeposite(bill) {
    this.selected_bill = bill;
    this.add_deposite = true;
    this.new_deposite = new Deposite();
  }

  saveDeposite() {
    this.billsManagementService.saveDeposite(this.bill_type, this.selected_bill._id, this.selected_bill.receiver, this.new_deposite)
      .subscribe(msg => {
        this.set_data();
        this.add_deposite = false;
        this.notify('success','Success Message','The deposite is credited successfully !');
      })
  }

  deleteDeposite(bill_id, deposite_id){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this deposite ?',
      accept : () => {
        this.billsManagementService.deleteDeposite(this.bill_type, bill_id, deposite_id)
          .subscribe(msg => {
            this.set_data();
            this.notify('success','Success Message','The deposite is deleted successfully !');
          })
      }
    });
    
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
