import { Component, OnInit, ViewChild, AfterViewChecked  } from '@angular/core';
import { Table } from 'primeng/table';
import { BillClothes } from 'src/models/bills/bill-clothes';
import { BillsManagementService } from 'src/services/bills-management.service';
import { MessageService} from 'primeng/api';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  @ViewChild('billTable') private _billTable: Table;

  dateFilters: any;
  dueDateFilters : any = [ new Date()];
  cols_bill : any[];
  selected_bill : BillClothes = new BillClothes();
  bills : BillClothes[];
  change_due_date : boolean = false;

  constructor(private billsManagementService : BillsManagementService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.set_config();
  }

  ngAfterViewChecked(){

    if(this._billTable != undefined)
    {
      const customFilterConstraints = this._billTable.filterConstraints;
      customFilterConstraints['between'] = this.dateRangeFilter;
      this._billTable.filterConstraints = customFilterConstraints;
      this._billTable.filter(this.dueDateFilters,'due_date', 'between');
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
      this.cols_bill = [
        { field : 'invoice_no_cloth', header : 'Invoice No', width : '10%' },
        { field : 'invoice_date', header : 'Invoice Date', width : '11%' },
        { field : 'bill_amount', header : 'Bill Amount', width : '15%' }
      ];
  }

  set_data(){
    this.billsManagementService.getBills('bill_cloth')
      .subscribe(bills => {
          this.bills = bills as BillClothes[];
      })
  }

  changeDueDate(bill){
    this.selected_bill = bill;
    this.selected_bill.invoice_date = new Date(this.selected_bill.invoice_date);
    this.selected_bill.due_date = new Date(this.selected_bill.due_date);
    this.change_due_date = true;
  }

  updateDueDate(){
    this.billsManagementService.updateDueDate('bill_cloth', this.selected_bill._id, this.selected_bill.due_date)
      .subscribe(bill => {
        this.set_data();
        this.change_due_date = false;
        this.notify('success','Success Message','The due date is updated successfully !');
      });
  }

  viewBill(bill_id : string){
    window.open("/preview-cloth-bill/"+bill_id,"_blank");
  }

  
  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
