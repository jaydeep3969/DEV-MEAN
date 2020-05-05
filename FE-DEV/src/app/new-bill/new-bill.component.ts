import { Component, OnInit } from '@angular/core';
import { BillClothes, ItemsCloth } from 'src/models/bills/bill-clothes';
import { BillsManagementService } from 'src/services/bills-management.service';
import { CustomerCloth } from 'src/models/customers/customer-cloth';
import { CustomerManagementService } from 'src/services/customer-management.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ItemsManagementService } from 'src/services/items-management.service';
import { Clothes } from 'src/models/items/clothes';
import { BillElectronics, ItemsElectronic } from 'src/models/bills/bill-electronics';
import { Electronics } from 'src/models/items/electronics';
import { CustomerElectronic } from 'src/models/customers/customer-electronic';
import { Deposite } from 'src/models/deposite';
import { BillAutomobiles, ItemsAutomobile } from 'src/models/bills/bill-automobiles';
import { Brands } from 'src/models/items/automobile/brands';
import { Submodels } from 'src/models/items/automobile/submodels';
import { CustomerAutomobile } from 'src/models/customers/customer-automobile';
import { ConfigManagementServiceService } from 'src/services/config-management-service.service';

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.css']
})
export class NewBillComponent implements OnInit {

  // -- for generic bill --
  selected_bill_type : string;
  selected_new_customer : string;
  bill_saved : boolean = false;
  bill_id : string;
  view_gst : boolean = false;

  // -- for bill form config --
  new_bill : any = new BillClothes(); 
  receiver : any = new CustomerCloth();
  new_item : any = new ItemsCloth();
  selected_item : any = new Clothes();
  selected_brand : Brands;

  // -- for steps of form --
  step_items: MenuItem[];
  activeIndex: number = 0;

  // -- for items in bill --
  cols : any[];
  items : any[];
  filtered_customers : any[];
  filtered_items : any[];
  customer_type : string;
  item_type : string;

  // -- to add and edit items in bill --
  add_item : boolean = false;
  edit_item : boolean = false;

  // -- for Bill(Cloth) --
  total_meters : number = 0;
  total_pcs : number = 0;
  
  // -- for Bill(Electronic) --
  total_qty : number = 0;
  add_SrModelNo : boolean = false;
  edit_SrModelNo : boolean = false;
  sr_no : string;
  deposite : Deposite = new Deposite();
  add_deposite : boolean = false;
  item_limit : number = 0;

  filtered_models : any[];

  constructor(private billsManagementService : BillsManagementService,
              private customerManagementService : CustomerManagementService,
              private itemsManagementService : ItemsManagementService,
              private messageService: MessageService,
              private configManagementService : ConfigManagementServiceService) { }

  ngOnInit() {
    this.selected_bill_type = "bill_cloth";
    this.customer_type = "customer_cloth";
    this.item_type = "clothes";
    this.set_config();
  }

  set_config(){
    this.selected_new_customer = "no";
    this.activeIndex = 0;
    this.bill_saved = false;
    this.set_steps();
    this.setBillFields();
    this.set_cols();
  }

  set_steps(){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.step_items = [
        {
          label : "Receiver",
          command : (event) => {
            this.activeIndex = 0;
          }
        },
        {
          label : "Consignee",
          command : (event) => {
            this.activeIndex = 1;
          }
        },
        {
          label : "Invoice",
          command : (event) => {
            this.activeIndex = 2;
          }
        },
        {
          label : "Items",
          command : (event) => {
            this.activeIndex = 3;
          }
        }
      ];  
    }
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.step_items = [
        {
          label : "Bill To",
          command : (event) => {
            this.activeIndex = 0;
          }
        },
        {
          label : "Items",
          command : (event) => {
            this.activeIndex = 1;
          }
        }
      ];
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.step_items = [
        {
          label : "Bill To",
          command : (event) => {
            this.activeIndex = 0;
          }
        },
        {
          label : "Items",
          command : (event) => {
            this.activeIndex = 1;
          }
        }
      ];
    }
  }

  setBillFields(){
    let gst_type : string;

    if(this.selected_bill_type == "bill_cloth")
    {
      this.new_bill = new BillClothes();
      this.new_item = new ItemsCloth();
      this.selected_item = new Clothes();
      this.receiver = new CustomerCloth();
      this.customer_type = "customer_cloth";
      this.item_type = "clothes";
      gst_type = "gst_cloth";
    }
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.new_bill = new BillElectronics();
      this.new_item = new ItemsElectronic();
      this.selected_item = new Electronics();
      this.receiver = new CustomerElectronic();
      this.customer_type = "customer_electronic";
      this.item_type = "electronics";
      gst_type = "gst_ele";
      this.item_limit = 0;
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.new_bill = new BillAutomobiles();
      this.new_item = new ItemsAutomobile();
      this.selected_brand = new Brands();
      this.selected_item = new Submodels();
      this.receiver = new CustomerAutomobile();
      this.customer_type = "customer_automobile";
      this.item_type = "automobiles";
      gst_type = "gst_auto";
    }

    this.items = [];

    this.configManagementService.getConfigByName(gst_type)
      .subscribe(config => {
        this.new_bill.cgst = config.value.cgst;
        this.new_bill.sgst = config.value.sgst;
      })
  }

  set_cols(){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.cols =[
        {field: 'description', header: 'Description', width : '23%'},
        {field: 'hsn_cd', header: 'HSN CD', width : '8%' },
        {field: 'pcs', header: 'Pcs.', width : '7%'},
        {field: 'cut', header: 'Cut', width : '7%'},
        {field: 'meters', header: 'Meters', width : '10%'},
        {field: 'rate', header: 'Rate', width : '10%'},
        {field: 'uqc', header: 'UQC', width : '7%'},
        {field: 'amount', header: 'Amount Rs', width : '14%'},
      ];
    }
    else if(this.selected_bill_type == "bill_electronic" || this.selected_bill_type == "bill_automobile")
    {
      this.cols =[
        {field: 'product_name', header: 'Product Name', width : '38%'},
        {field: 'quantity', header: 'Quantity', width : '10%' },
        {field: 'rate', header: 'Rate', width : '15%'},
        {field: 'amount', header: 'Amount Rs', width : '20%'}
      ];
    }
  }

  //CRUD for Bill Items

  addItem(){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.new_item = new ItemsCloth(); 
      this.selected_item = new Clothes();     
    }
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.new_item = new ItemsElectronic();
      this.selected_item = new Electronics();
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.new_item = new ItemsAutomobile();
      this.selected_item = new Submodels();
      this.selected_brand = new Brands();
    }
    this.add_item = true;
  }

  saveItem(){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.total_pcs += this.new_item.pcs;
      this.total_meters += this.new_item.meters;
      this.new_item.description = this.selected_item.name;
      this.new_item.amount = this.new_item.meters * this.new_item.rate;
      this.new_item.profit =  this.new_item.amount - (this.selected_item.pp * this.new_item.meters);
      this.new_bill.total_amount += this.new_item.amount;
      this.new_bill.profit += this.new_item.profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    }
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.new_item.product_name = this.selected_item.name;
      this.new_item.amount = this.new_item.rate * this.new_item.quantity;
      this.new_item.profit = this.new_item.amount - (this.selected_item.pp * this.new_item.quantity);
      this.new_bill.total_amount += this.new_item.amount;
      this.new_bill.profit += this.new_item.profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
      this.item_limit += 3;
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.new_item.brand_name = this.selected_brand.name;
      this.new_item.model_name = this.selected_item.name;
      this.new_item.amount = this.new_item.rate * this.new_item.quantity;
      this.new_item.profit = this.new_item.amount - (this.selected_item.pp * this.new_item.quantity);
      this.new_bill.total_amount += this.new_item.amount;
      this.new_bill.profit += this.new_item.profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    }

    this.items.push(this.new_item);
    this.add_item = false;

  }

  editItem(index){
    let item_name : string;
    let brand_name : string = "";

    if(this.selected_bill_type == "bill_cloth")
    {
      this.total_pcs -= this.items[index].pcs;
      this.total_meters -= this.items[index].meters;
      this.new_bill.total_amount -= this.items[index].amount;
      this.new_bill.profit -= this.items[index].profit;
      item_name = this.items[index].description;
    }
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.total_qty -= this.items[index].quantity;
      this.new_bill.total_amount -= this.items[index].amount;
      this.new_bill.profit -= this.items[index].profit;     
      item_name = this.items[index].product_name; 
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.total_qty -= this.items[index].quantity;
      this.new_bill.total_amount -= this.items[index].amount;
      this.new_bill.profit -= this.items[index].profit;     
      item_name = this.items[index].model_name; 
      brand_name = this.items[index].brand_name;
    }

    this.new_item = this.items[index];
    // this.new_item.index = index;
    this.edit_item = true;

    this.itemsManagementService.getItemByName(this.item_type, item_name, brand_name)
      .subscribe(item => {
        this.selected_item = item;
      });

  }

  updateItem(index){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.total_pcs += this.items[index].pcs;
      this.total_meters += this.items[index].meters;
      this.items[index].description = this.selected_item.name;
      this.items[index].amount = this.new_item.meters * this.new_item.rate;
      this.items[index].profit = this.items[index].amount - (this.selected_item.pp * this.new_item.meters);
      this.new_bill.total_amount += this.items[index].amount;
      this.new_bill.profit += this.items[index].profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    } 
    else if(this.selected_bill_type == "bill_electronic")
    {
      this.total_qty += this.new_item.quantity;
      this.items[index].product_name = this.selected_item.name;
      this.items[index].amount = this.new_item.quantity * this.new_item.rate;
      this.items[index].profit = this.items[index].amount - (this.selected_item.pp * this.new_item.quantity);
      this.new_bill.total_amount += this.items[index].amount;
      this.new_bill.profit += this.items[index].profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    }
    else if(this.selected_bill_type == "bill_automobile")
    {
      this.total_qty += this.new_item.quantity;
      this.items[index].brand_name = this.selected_brand.name;
      this.items[index].model_name = this.selected_item.name;
      this.items[index].amount = this.new_item.quantity * this.new_item.rate;
      this.items[index].profit = this.items[index].amount - (this.selected_item.pp * this.new_item.quantity);
      this.new_bill.total_amount += this.items[index].amount;
      this.new_bill.profit += this.items[index].profit;
      this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    }

    this.edit_item = false;
  }

  deleteItem(index){
    if(this.selected_bill_type == "bill_cloth")
    {
      this.total_pcs -= this.items[index].pcs;
      this.total_meters -= this.items[index].meters;
      
    }
    else if(this.selected_bill_type == "bill_electronic" || this.selected_bill_type == "bill_automobile")
    {
      this.total_qty -= this.items[index].quantity;
      this.item_limit -= 3;
      this.item_limit -= this.items[index].quantity;
    }

    this.new_bill.total_amount -= this.items[index].amount;
    this.new_bill.profit -= this.items[index].profit;
    this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100);
    
    if(index != -1)
      this.items.splice(index, 1);
  }

  //Methods for Specially Bill(Electronic)

  addSrModelNo(index){
    this.sr_no = "";
    this.add_SrModelNo = true;
    this.new_bill.total_amount -= this.items[index].amount;
    this.new_bill.profit -= this.items[index].profit;
  }

  saveSrModelNo(index){
    this.items[index].sr_no.push(this.sr_no);
    this.add_SrModelNo = false;
    this.items[index].quantity++;
    this.total_qty++;
    this.item_limit++;
    this.quantityChanged(index);
  }

  editSrModelNo(index, index_no){
    this.sr_no = this.items[index].sr_no[index_no];
    this.edit_SrModelNo = true;
  }

  updateSrModelNo(index, index_no){
    this.items[index].sr_no[index_no] = this.sr_no;
    this.edit_SrModelNo = false;
  } 

  deleteSrModelNo(index, index_item){
    this.items[index].sr_no.splice(index_item, 1);
    this.items[index].quantity--;
    this.total_qty--; 
    this.new_bill.total_amount -= this.items[index].amount;
    this.new_bill.profit -= this.items[index].profit;  
    this.item_limit--;
    this.quantityChanged(index);
  }

  quantityChanged(index){

    let name : string;
    let brand : string = "";

    if(this.selected_bill_type == "bill_electronic")
      name = this.items[index].product_name;
    else if(this.selected_bill_type == "bill_automobile")
    {
      name = this.items[index].model_name;
      brand = this.items[index].brand_name;
    }

    this.itemsManagementService.getItemByName(this.item_type, name, brand)
      .subscribe(item => {
        this.selected_item = item;
        this.items[index].amount = this.items[index].quantity * this.items[index].rate;
        this.items[index].profit = this.items[index].amount - (this.selected_item.pp * this.items[index].quantity);
        this.new_bill.total_amount += this.items[index].amount;
        this.new_bill.profit += this.items[index].profit;
        this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100); 
    });
  }

  addDeposite(){
    this.add_deposite = true;
    if(this.new_bill.deposite.length != 0)
      this.deposite = this.new_bill.deposite[0];
    else
      this.deposite = new Deposite();
  }

  saveDeposite() {
    if(this.new_bill.deposite.length == 0){
      this.new_bill.deposite.push(this.deposite);
    
      if(this.new_bill.bill_amount - this.deposite.amount > 5)
        this.new_bill.due_amount = this.new_bill.bill_amount - this.deposite.amount;
      else
        this.new_bill.due_amount = 0;
    }
    else
      this.new_bill.deposite[0] = this.deposite;
    this.add_deposite = false;
  }

  updateGST(){
    this.new_bill.bill_amount = this.new_bill.total_amount + (this.new_bill.total_amount * this.new_bill.cgst / 100) + (this.new_bill.total_amount * this.new_bill.sgst / 100); 
    this.view_gst = false;
  }
  
  //Suggestion for AutoComplete InputText
  searchCustomers(event) {
    let query = event.query;
    this.customerManagementService.getCustomers(this.customer_type)
      .subscribe(customers => {
        this.filtered_customers = this.filterElement(query, customers);
    });
  }

  searchItems(event) {
    let query = event.query;
    this.itemsManagementService.getItems(this.item_type)
      .subscribe(items => {
        this.filtered_items = this.filterElement(query, items);
      })
  }

  searchModel(event) {
    let query = event.query;
    this.filtered_models = this.filterElement(query, this.selected_brand.submodels)
  }

  filterElement(query, list : any[]) : any[]{
    let filtered : any[] = [];
        for(let i = 0; i < list.length; i++) {
            let element = list[i];
            if(element.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(element);
            }
        }
        return filtered;
  }


  //Steps Navigation
  nextStep(){
    this.activeIndex++;
  }

  backStep(){
    this.activeIndex--;
  }

  //Bill Creation
  saveBill(){
    this.new_bill.items = this.items;
    if(this.selected_new_customer == 'yes')
    {
      this.new_bill.new_receiver = this.receiver;
      this.new_bill.receiver = null;
    }
    else if(this.selected_new_customer == 'no')
    {
      this.new_bill.new_receiver = null;
      this.new_bill.receiver = this.receiver._id;
    }
    this.new_bill.bill_amount = Math.round(this.new_bill.bill_amount);

    this.billsManagementService.addBill(this.selected_bill_type, this.new_bill)
      .subscribe(bill => {
        this.bill_id = bill._id;
        this.bill_saved = true;
        console.log("Bill Added");
        this.notify('success','Success Message','The Bill is successfully saved !');

        if(this.selected_bill_type == 'bill_cloth')
        {
          window.open("/preview-cloth-bill/"+this.bill_id,"_blank");
        }
        else if(this.selected_bill_type == 'bill_electronic')
        {
          window.open("/preview-ele-bill/"+this.bill_id,"_blank");
        }
        else if(this.selected_bill_type == 'bill_automobile')
        {
          window.open("/preview-auto-bill/"+this.bill_id,"_blank");
        }
      });
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }

}
