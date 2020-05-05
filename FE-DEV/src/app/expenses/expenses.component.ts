import { Component, OnInit,  ViewChild, AfterViewChecked } from '@angular/core';
import { Expense } from 'src/models/expense';
import { OtherExpenseManagementService } from 'src/services/other-expense-management.service';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  @ViewChild('expenseTable') private _table: Table;

  new_expense : Expense = new Expense();
  add_expense : boolean= false;
  edit_expense : boolean = false;
  cols : any[];
  expenses : Expense[];
  dateFilters : any;

  constructor(private expenseManagementService : OtherExpenseManagementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Date', width : '17%' },
      { field: 'details', header: 'Details', width : '30%' },
      { field: 'amount', header: 'Amount', width : '15%' },
      { field: 'name', header: 'Person Name', width : '15%' },
    ];

    this.set_data();
  }

  ngAfterViewChecked(){
    const customFilterConstraints = this._table.filterConstraints;
    customFilterConstraints['between'] = this.dateRangeFilter;
    this._table.filterConstraints = customFilterConstraints;
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

  set_data(){
    this.expenseManagementService.getExpenses()
      .subscribe(expenses => {
        this.expenses = expenses as Expense[];
      })
  }

  addExpense(){
    this.new_expense = new Expense();
    this.add_expense = true;
  }

  saveExpense() {
    this.expenseManagementService.addExpense(this.new_expense)
      .subscribe(exp => {
        this.set_data();
        this.add_expense = false;
        this.notify('success','Success Message','New Expense is successfully added !');
      })
  }

  editExpense(expense : Expense) {
    this.new_expense = expense;
    this.new_expense.date = new Date(this.new_expense.date);
    this.edit_expense = true;
  }

  updateExpense() {
    this.expenseManagementService.updateExpense(this.new_expense._id, this.new_expense)
      .subscribe(exp => {
        this.set_data();
        this.edit_expense = false;
        this.notify('success','Success Message','Expense is updated successfully !');
      })
  }

  deleteExpense(id : string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this expense ?',
      accept: () => {
        this.expenseManagementService.deleteExpense(id)
          .subscribe(msg => {  
              this.set_data();
              this.notify('success','Success Message','The expense is successfully deleted !');
           });
      }
    });
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }

}
