import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Deposite } from 'src/models/deposite';
import { BillElectronics } from 'src/models/bills/bill-electronics';
import { BillsManagementService } from 'src/services/bills-management.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Table } from 'primeng/table';
import { BillClothes } from 'src/models/bills/bill-clothes';
import { BillAutomobiles } from 'src/models/bills/bill-automobiles';


@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  @ViewChild('billTable') private _billTable: Table;
  @ViewChild('depositeTable') private _depositeTable: Table;

  selected_bill_type : string = "bill_cloth";
  cols_bill : any[];
  bills : any[];
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

  constructor(private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private billsManagementService : BillsManagementService) { }

  ngOnInit() {
    this.selected_bill_type = "bill_cloth";
    this.set_config();
  }

  ngAfterViewChecked(){

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

  set_config(){
    this.set_data();
    this.set_cols();
  }

  set_cols(){
    if(this.selected_bill_type == "bill_cloth"){
      this.cols_bill = [
        { field : 'invoice_no_cloth', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '20%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '23%' },
        { field : 'due_date', header : 'Due Date', width : '20%' },
      ];
    }
    else if(this.selected_bill_type == "bill_electronic"){
      this.cols_bill = [
        { field : 'invoice_no_ele', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '12%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '20%' },
        { field : 'due_amount', header : 'Due Amount', width : '20%' },
      ];
    }
    else if(this.selected_bill_type == "bill_automobile"){
      this.cols_bill = [
        { field : 'invoice_no_auto', header : 'Invoice No', width : '15%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '20%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '22%' }
      ];
    }
  }

  set_data(){
    this.billsManagementService.getBills(this.selected_bill_type)
      .subscribe(bills => {
        if(this.selected_bill_type == "bill_cloth")
          this.bills = bills as BillClothes[];
        else if(this.selected_bill_type == "bill_electronic")
          this.bills = bills as BillElectronics[];
        else if(this.selected_bill_type == "bill_automobile")
          this.bills = bills as BillAutomobiles[];
      })
  }

  viewBill(bill_id : string){
    if(this.selected_bill_type == "bill_cloth")
      window.open("/preview-cloth-bill/"+bill_id,"_blank");
    else if(this.selected_bill_type == "bill_electronic")
      window.open("/preview-ele-bill/"+bill_id,"_blank");
    else if(this.selected_bill_type == "bill_automobile")
      window.open("/preview-auto-bill/"+bill_id,"_blank");
  }

  deleteBill(bill_id : string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this bill ?',
      accept : () => {
        this.billsManagementService.deleteBill(this.selected_bill_type, bill_id)
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
    this.billsManagementService.saveDeposite(this.selected_bill_type, this.selected_bill._id, this.selected_bill.receiver._id, this.new_deposite)
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
        this.billsManagementService.deleteDeposite(this.selected_bill_type, bill_id, deposite_id)
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
