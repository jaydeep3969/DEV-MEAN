import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ItemsAutomobile, BillAutomobiles } from 'src/models/bills/bill-automobiles';
import { CustomerAutomobile } from 'src/models/customers/customer-automobile';
import { BillsManagementService } from 'src/services/bills-management.service';

@Component({
  selector: 'app-preview-automobile-bill',
  templateUrl: './preview-automobile-bill.component.html',
  styleUrls: ['./preview-automobile-bill.component.css']
})
export class PreviewAutomobileBillComponent implements OnInit {

  bill_id : string;
  items : ItemsAutomobile[];
  bill : BillAutomobiles;
  total_qty : number = 0;
  receiver : CustomerAutomobile;
  cols : any[];
  bill_loaded : boolean = false;

  constructor(private billsManagementService : BillsManagementService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.bill_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getBill();

    this.cols =[
      {field: 'product_name', header: 'Product Name', width : '45%', align : null},
      {field: 'quantity', header: 'Quantity', width : '10%', align : null },
      {field: 'rate', header: 'Rate', width : '20%', align : 'right'},
      {field: 'amount', header: 'Amount Rs', width : '20%', align : 'right'}
    ];
  }

  getBill(){
    this.billsManagementService.getBill('bill_automobile', this.bill_id)
      .subscribe(bill =>{
        this.bill = bill as BillAutomobiles;
        this.items = this.bill.items;
        this.receiver = this.bill.receiver;
        this.calculateTotal();
      })
  }

  calculateTotal(){
    for(let i=0; i < this.items.length; i++)
    {
      this.total_qty += this.items[i].quantity;
      this.bill_loaded = true;
    }
  }

}
