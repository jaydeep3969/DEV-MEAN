import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ItemsCloth, BillClothes } from 'src/models/bills/bill-clothes';
import { CustomerCloth } from 'src/models/customers/customer-cloth';
import { BillsManagementService } from 'src/services/bills-management.service';
import { ConfigManagementServiceService } from 'src/services/config-management-service.service';
import { Config } from 'src/models/config';

@Component({
  selector: 'app-preview-cloth-bill',
  templateUrl: './preview-cloth-bill.component.html',
  styleUrls: ['./preview-cloth-bill.component.css']
})
export class PreviewClothBillComponent implements OnInit {

  // @Input() bill_id : string;
  bill_id : string = "";
  items : ItemsCloth[] = [];
  bill : BillClothes;
  total_meters : number = 0;
  total_pcs : number = 0;
  receiver : CustomerCloth;
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
      {field: 'description', header: 'Description', width : '33%'},
      {field: 'hsn_cd', header: 'HSN CD', width : '10%' },
      {field: 'pcs', header: 'Pcs.', width : '7%'},
      {field: 'cut', header: 'Cut', width : '7%'},
      {field: 'meters', header: 'Meters', width : '8%'},
      {field: 'rate', header: 'Rate', width : '9%'},
      {field: 'uqc', header: 'UQC', width : '7%'},
      {field: 'amount', header: 'Amount Rs', width : '15%'},
    ];
  }

  getBill(){
      this.billsManagementService.getBill('bill_cloth', this.bill_id)
      .subscribe(bill =>{
        this.bill = bill as BillClothes;
        this.items = this.bill.items;
        
        for (let i = 0; i < (8-this.items.length);i++) 
        { 
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
      });
    
  }

  calculateTotal(){
    for(let i=0; i < this.items.length; i++)
    {
      this.total_meters += this.items[i].meters;
      this.total_pcs += this.items[i].pcs;
      this.bill_loaded = true;
    }
  }

  
}
