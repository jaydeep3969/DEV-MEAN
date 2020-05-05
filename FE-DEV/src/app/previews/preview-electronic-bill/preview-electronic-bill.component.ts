import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ItemsElectronic, BillElectronics } from 'src/models/bills/bill-electronics';
import { CustomerElectronic } from 'src/models/customers/customer-electronic';
import { BillsManagementService } from 'src/services/bills-management.service';
import { ConfigManagementServiceService } from 'src/services/config-management-service.service';
import { Config } from 'src/models/config';

@Component({
  selector: 'app-preview-electronic-bill',
  templateUrl: './preview-electronic-bill.component.html',
  styleUrls: ['./preview-electronic-bill.component.css']
})
export class PreviewElectronicBillComponent implements OnInit {

  bill_id : string;
  items : ItemsElectronic[] = [];
  bill : BillElectronics;
  total_qty : number = 0;
  receiver : CustomerElectronic;
  cols : any[];
  bill_loaded : boolean = false;
  bank_details : Config;
  blanks : number[] = [];

  constructor(private billsManagementService : BillsManagementService,
              private configManagementService : ConfigManagementServiceService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.bill_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getBill();

    this.cols =[
      {field: 'product_name', header: 'Product Name', width : '47%', align : null},
      {field: 'quantity', header: 'Quantity', width : '10%', align : null },
      {field: 'rate', header: 'Rate', width : '20%', align : 'right'},
      {field: 'amount', header: 'Amount Rs', width : '20%', align : 'right'}
    ];
  }

  getBill(){
    this.billsManagementService.getBill('bill_electronic', this.bill_id)
      .subscribe(bill =>{
        this.bill = bill as BillElectronics;
        this.items = this.bill.items;
        
        let occupied_lines = 0;
        this.items.forEach(item => {
          occupied_lines += 3;
          occupied_lines += item.quantity;
        })

        for(let i=0; i < 27-occupied_lines; i++){
          this.blanks.push(i);
        }

        this.receiver = this.bill.receiver;
        this.calculateTotal();

        if(bill.bank_detail)
        {
          this.configManagementService.getConfigByName('bank')
            .subscribe(config => {
              this.bank_details = config;
            })
        }
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


